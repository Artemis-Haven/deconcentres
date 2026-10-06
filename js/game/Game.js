import { BOARD_SIZE, EFFECT_NAMES, GAME_STATE, HINT_DELAY_MS } from "../constants.js";
import { Board } from "../board/Board.js";
import { Factory } from "./Factory.js";
import { Animation } from "../systems/Animation.js";
import { IndependentEffects } from "../systems/IndependentEffects.js";
import { EffectAnimation } from "../systems/EffectAnimation.js";
import { Input } from "../systems/Input.js";
import { MatchFinder } from "../systems/MatchFinder.js";
import { Resolver } from "../systems/Resolver.js";
import { Score } from "../systems/Score.js";
import { Hud } from "../ui/Hud.js";
import { createEffectBadge } from "../ui/icons.js";
import { MEDIA_CATALOG } from "../mediaCatalog.js";
import { trackEvent } from "../analytics.js";

export class Game {

    constructor() {
        this.board = new Board(BOARD_SIZE);
        this.input = new Input(this);
        this.boardElement = document.getElementById("board");
        this.resolver = new Resolver(this);
        this.isBusy = false;
        this.state = GAME_STATE.READY;
        this.startOverlay = document.getElementById("start-overlay");
        this.gameOverOverlay = document.getElementById("gameover-overlay");
        this.score = new Score();
        this.hud = new Hud(this);

        // Un élément par tuile, réutilisé d'un rendu à l'autre : recréer toutes les cases
        // à chaque étape d'animation faisait clignoter les logos sur mobile et tablette
        this.tileElements = new WeakMap();
        this.hintTimer = null;

        // Clavier et toucher simple : case active (tabulation) et case sélectionnée
        this.focusPosition = { x: 0, y: 0 };
        this.selected = null;
        this.statusElement = document.getElementById("game-status");
        this.overlayInertElements = document.querySelectorAll(".header, .side-column, #board, .footer, .skip-link");

        this.preloadedImages = this.preloadImages();
        this.listenToBoard();
    }

    // Précharge tous les logos : une tuile qui apparaît s'affiche sans délai
    preloadImages() {
        return Object.values(MEDIA_CATALOG)
            .flatMap(catalog => catalog.items)
            .map(item => {
                const image = new Image();
                image.src = `./assets/${item.img}`;
                return image;
            });
    }

    // Écouteurs posés une seule fois sur la grille : les cases, elles, sont déplacées
    listenToBoard() {
        this.boardElement.addEventListener("pointerdown", event => {
            const element = event.target.closest(".cell");

            if (!element) return;

            // Le joueur agit : on retire l'indice et on relance le délai
            this.scheduleHint();

            const cell = this.board.get(Number(element.dataset.x), Number(element.dataset.y));
            this.input.handlePointerDown(cell, event);
        });
        this.boardElement.addEventListener("pointerup", event => {
            this.input.handlePointerUp(event);
        });
        this.boardElement.addEventListener("pointercancel", () => {
            this.input.handlePointerCancel();
        });

        this.boardElement.addEventListener("keydown", event => this.handleKeyDown(event));

        // La case active suit le focus, y compris après un clic
        this.boardElement.addEventListener("focusin", event => {
            const element = event.target.closest(".cell");

            if (element) {
                this.setFocusPosition(Number(element.dataset.x), Number(element.dataset.y));
            }
        });
    }

    // Clavier : flèches pour se déplacer, Entrée ou Espace pour sélectionner,
    // puis une flèche pour échanger avec la case voisine ; Échap pour annuler
    handleKeyDown(event) {
        const directions = {
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            ArrowUp: [0, -1],
            ArrowDown: [0, 1]
        };
        const { x, y } = this.focusPosition;

        if (directions[event.key]) {
            event.preventDefault();

            const [dx, dy] = directions[event.key];
            const target = this.board.get(x + dx, y + dy);

            if (!target) return;

            if (this.selected) {
                const origin = this.board.get(this.selected.x, this.selected.y);
                this.clearSelection();
                this.focusCell(target.x, target.y);
                this.scheduleHint();
                this.swap(origin, target);
            } else {
                this.focusCell(target.x, target.y);
            }
        } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            this.scheduleHint();
            this.selectCell(this.board.get(x, y));
        } else if (event.key === "Escape" && this.selected) {
            event.preventDefault();
            this.clearSelection();
            this.announce("Sélection annulée.");
        }
    }

    // Toucher ou clic sans glisser, et Entrée au clavier : sélectionne une case,
    // ou l'échange avec la case déjà sélectionnée si elles sont voisines
    selectCell(cell) {
        if (this.state !== GAME_STATE.PLAYING || this.isBusy || !cell) return;

        if (this.selected) {
            const origin = this.board.get(this.selected.x, this.selected.y);
            this.clearSelection();

            if (origin === cell) {
                this.announce("Sélection annulée.");
                return;
            }

            if (this.areAdjacent(origin, cell)) {
                this.swap(origin, cell);
                return;
            }
        }

        if (!cell.tile) return;

        this.selected = { x: cell.x, y: cell.y };
        this.getCellElement(cell.x, cell.y)?.setAttribute("aria-selected", "true");
        this.announce(`${this.describeTile(cell.tile)} sélectionné. Choisis une case voisine pour l'échanger.`);
    }

    clearSelection() {
        if (!this.selected) return;

        this.getCellElement(this.selected.x, this.selected.y)?.setAttribute("aria-selected", "false");
        this.selected = null;
    }

    setFocusPosition(x, y) {
        const previous = this.getCellElement(this.focusPosition.x, this.focusPosition.y);
        const next = this.getCellElement(x, y);

        if (previous && previous !== next) previous.tabIndex = -1;
        if (next) next.tabIndex = 0;

        this.focusPosition = { x, y };
    }

    focusCell(x, y) {
        this.setFocusPosition(x, y);
        this.getCellElement(x, y)?.focus();
    }

    // Texte lu par les lecteurs d'écran pour une case
    describeTile(tile) {
        if (!tile) return "Case vide";

        if (tile.isOwner()) return `Propriétaire : ${tile.name}`;

        if (tile.isIndependent()) {
            return `${tile.name}, média indépendant, effet ${EFFECT_NAMES[tile.effect]}`;
        }

        return `${tile.name}, média de ${MEDIA_CATALOG[tile.color].owner}`;
    }

    // Message lu par les lecteurs d'écran (zone live, invisible à l'écran)
    announce(message) {
        this.statusElement.textContent = "";

        // Vider puis remplir : un message identique au précédent est quand même relu
        requestAnimationFrame(() => {
            this.statusElement.textContent = message;
        });
    }

    // Écran de début ou de fin : le reste de la page n'est plus atteignable
    setOverlayOpen(open) {
        for (const element of this.overlayInertElements) {
            element.inert = open;
        }
    }

    start() {
        document.getElementById("start-button").addEventListener("click", () => {
            this.startGame();
        });
        document.getElementById("restart-button").addEventListener("click", () => {
            this.restartGame();
        });
        this.setOverlayOpen(true);
        this.render();
    }

    fillBoard() {
        for (let y = 0; y < this.board.size; y++) {
            for (let x = 0; x < this.board.size; x++) {
                const cell = this.board.get(x, y);

                if (cell.tile?.isOwner?.()) continue;

                cell.tile =
                    Factory.randomMediaSafe(this.board, x, y);
            }
        }
    }

    checkGameOver() {
        if (!MatchFinder.hasPossibleMove(this.board)) {
            this.gameOver();
        }
    }

    async swap(cellA, cellB) {
        if (this.isBusy || !this.areAdjacent(cellA, cellB)) return;

        this.isBusy = true;
        this.clearSelection();

        const scoreBefore = this.score.total;
        let refusal = null;

        try {
            const elA = this.getCellElement(cellA.x, cellA.y);
            const elB = this.getCellElement(cellB.x, cellB.y);

            await Animation.swap(elA, elB);
            this.board.swap(cellA, cellB);

            const a = cellA.tile;
            const b = cellB.tile;

            if (MatchFinder.isActivatableIndependentPair(cellA, cellB)) {
                // Rendu immédiat : sans lui, la transition CSS ramène
                // visuellement les tuiles à leur place d'origine
                this.render();
                this.score.startMove(this.board.countOwners());
                await this._activateIndependentPair(cellA, cellB);
            } else if (a?.isIndependent?.() && b?.isIndependent?.()) {
                // Deux indépendants d'effets différents : l'échange est refusé
                this.board.swap(cellA, cellB);
                await Animation.swap(elA, elB);
                refusal = "Échange impossible : ces deux médias indépendants n'ont pas le même effet.";
            } else {
                const played = await this._handleMatch3Swap(cellA, cellB, elA, elB);

                if (!played) {
                    refusal = "Échange impossible : aucun alignement.";
                }
            }
        } finally {
            this.isBusy = false;
            this.scheduleHint();
        }

        if (refusal) {
            this.announce(refusal);
        } else if (this.state === GAME_STATE.PLAYING) {
            const owners = this.board.countOwners();
            const gained = this.score.total - scoreBefore;

            this.announce(
                `+${this.hud.formatNumber(gained)} points. Score : ${this.hud.formatNumber(this.score.total)}. ` +
                `${owners} propriétaire${owners > 1 ? "s" : ""} sur la grille.`
            );
        }
    }

    // Montre un coup jouable après HINT_DELAY_MS sans action du joueur
    scheduleHint() {
        this.clearHint();

        if (this.state !== GAME_STATE.PLAYING) return;

        this.hintTimer = setTimeout(() => this.showHint(), HINT_DELAY_MS);
    }

    showHint() {
        if (this.state !== GAME_STATE.PLAYING || this.isBusy) return;

        const move = MatchFinder.findPossibleMove(this.board);

        if (!move) return;

        const [cellA, cellB] = move;

        // Les deux tuiles se rapprochent l'une de l'autre, dans le sens de l'échange
        for (const [cell, other] of [[cellA, cellB], [cellB, cellA]]) {
            const element = this.getCellElement(cell.x, cell.y);

            element.style.setProperty("--hint-dx", other.x - cell.x);
            element.style.setProperty("--hint-dy", other.y - cell.y);
            element.classList.add("hint");
        }

        this.announce(`Indice : échanger ${this.describeTile(cellA.tile)} et ${this.describeTile(cellB.tile)}.`);
    }

    clearHint() {
        clearTimeout(this.hintTimer);
        this.hintTimer = null;

        for (const element of this.boardElement.querySelectorAll(".hint")) {
            element.classList.remove("hint");
            element.style.removeProperty("--hint-dx");
            element.style.removeProperty("--hint-dy");
        }
    }

    areAdjacent(cellA, cellB) {
        return Math.abs(cellA.x - cellB.x) + Math.abs(cellA.y - cellB.y) === 1;
    }

    async _activateIndependentPair(cellA, cellB) {
        const a = cellA.tile;

        await EffectAnimation.highlight([cellA, cellB], this);

        const affected = IndependentEffects.apply(a.effect, cellB, this);
        const points = this.score.scoreIndependent(affected.map(cell => cell.tile));
        this.hud.showPoints(cellB, points);

        await EffectAnimation.play(a.effect, affected, this, cellB);

        cellA.tile = null;
        cellB.tile = null;

        for(const cell of affected) {
            cell.tile = null;
        }
        this.render();
        await this.resolver.resolve();
    }

    async _handleMatch3Swap(cellA, cellB, elA, elB) {
        const matches = MatchFinder.find(this.board);

        if (matches.length === 0) {
            // Aucun alignement : l'échange est refusé
            this.board.swap(cellA, cellB);
            await Animation.swap(elA, elB);
            return false;
        }

        this.score.startMove(this.board.countOwners());
        this.render();
        await this.resolver.resolve([cellA, cellB]);
        return true;
    }

    render({ hideEmpty = false } = {}) {
        const rows = [];
        const reused = [];
        const hadFocus = this.boardElement.contains(document.activeElement);

        for (let y = 0; y < this.board.size; y++) {
            // Lignes de la grille pour les lecteurs d'écran (sans effet sur la mise en page)
            const row = document.createElement("div");
            row.className = "board-row";
            row.setAttribute("role", "row");
            rows.push(row);

            for (let x = 0; x < this.board.size; x++) {
                const tile = this.board.get(x, y).tile;
                let element;

                if (!tile) {
                    element = this.createEmptyElement(hideEmpty);
                } else if (this.tileElements.has(tile)) {
                    element = this.tileElements.get(tile);
                    this.resetTileElement(element);
                    reused.push(element);
                } else {
                    element = this.createTileElement(tile);
                    this.tileElements.set(tile, element);
                }

                element.dataset.x = x;
                element.dataset.y = y;
                element.setAttribute("role", "gridcell");
                element.setAttribute("aria-label", this.describeTile(tile));
                element.setAttribute("aria-selected", String(this.selected?.x === x && this.selected?.y === y));
                element.tabIndex = this.focusPosition.x === x && this.focusPosition.y === y ? 0 : -1;
                row.appendChild(element);
            }
        }

        this.boardElement.replaceChildren(...rows);

        // Les cases ont été retirées puis remises : on rend le focus à la case active
        if (hadFocus) {
            this.getCellElement(this.focusPosition.x, this.focusPosition.y)?.focus({ preventScroll: true });
        }

        // Rétablit les transitions une fois les cases réutilisées remises en place
        if (reused.length > 0) {
            void this.boardElement.offsetWidth;

            for (const element of reused) {
                element.style.transition = "";
            }
        }

        this.hud.update();
    }

    createEmptyElement(hideEmpty) {
        const div = document.createElement("div");
        div.className = "cell empty-cell";

        if (hideEmpty) {
            div.classList.add("empty-cell-hidden");
        }

        const inner = document.createElement("div");
        inner.className = "cell-inner";
        div.appendChild(inner);

        return div;
    }

    createTileElement(tile) {
        const div = document.createElement("div");
        div.className = "cell";
        const inner = document.createElement("div");
        inner.className = "cell-inner";

        if (tile.isMedia()) {
            const logo = document.createElement("div");
            logo.className = "cell-logo";
            logo.style.backgroundImage = `url('./assets/${tile.img}')`;
            inner.appendChild(logo);
            div.classList.add(
                tile.isIndependent() ? "cell--independent" : "cell--media",
                `tile-${tile.color}`
            );

            // Vrai logo : affiché selon ses options, sans le nom sauf si demandé.
            // Image provisoire : le nom est toujours affiché en dessous
            if (tile.logo) {
                div.classList.add("has-logo", `logo--${tile.logo.style ?? "plain"}`);
                div.classList.toggle("logo--wide", Boolean(tile.logo.wide));
                div.classList.toggle("logo--named", Boolean(tile.logo.showName));

                if (tile.logo.size) {
                    div.style.setProperty("--logo-size", `${tile.logo.size}%`);
                }

            }

            if (!tile.logo || tile.logo.showName) {
                const label = document.createElement("div");
                label.className = "cell-label";
                label.textContent = tile.shortName ?? tile.name;
                inner.appendChild(label);
            }

            // Indépendants : nuance et icône selon leur effet
            if (tile.isIndependent()) {
                div.classList.add(`indep-${tile.effect}`);
                div.appendChild(createEffectBadge(tile.effect, "cell-badge"));
            }
        } else if (tile.isOwner()) {
            const owner = document.createElement("div");
            owner.className = "cell-owner";
            owner.textContent = tile.name;
            inner.appendChild(owner);
            div.classList.add("cell--owner", `tile-${tile.color}`);
        }

        div.appendChild(inner);

        // Classes d'origine, rétablies à chaque réutilisation
        div.baseClassName = div.className;

        return div;
    }

    // Efface les états laissés par les animations (classes, déplacements),
    // sans transition pour que la case ne glisse pas vers sa nouvelle place
    resetTileElement(element) {
        element.className = element.baseClassName;
        element.style.transition = "none";
        element.style.transform = "";
    }

    getCellElement(x, y) {
        return this.boardElement.querySelector(
            `[data-x="${x}"][data-y="${y}"]`
        );
    }

    startGame() {
        trackEvent("partie-lancee", "Partie lancée");
        this.state = GAME_STATE.PLAYING;
        this.startOverlay.classList.add("hidden");
        this.setOverlayOpen(false);
        this.selected = null;
        this.focusPosition = { x: 0, y: 0 };
        this.board = new Board(BOARD_SIZE);
        this.score.reset();
        this.fillBoard();
        this.checkGameOver();
        this.render();
        this.scheduleHint();

        // Le bouton de lancement a disparu : le focus passe sur la grille
        this.getCellElement(0, 0)?.focus();
    }

    restartGame() {
        this.gameOverOverlay.classList.add("hidden");
        this.startGame();
    }

    gameOver() {
        trackEvent("partie-terminee", "Partie terminée");
        this.state = GAME_STATE.GAME_OVER;
        this.clearHint();
        this.score.saveBest();
        this.hud.renderGameOver();
        this.hud.update();
        this.gameOverOverlay.classList.remove("hidden");
        this.setOverlayOpen(true);
        // Focus sur « Relancer », mais la boîte reste affichée depuis son début
        document.getElementById("restart-button").focus({ preventScroll: true });
        this.gameOverOverlay.querySelector(".overlay-box").scrollTop = 0;
        this.announce(`Partie terminée, il n'y a plus aucun coup possible. Score : ${this.hud.formatNumber(this.score.total)}.`);
    }
}
