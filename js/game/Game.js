import { BOARD_SIZE, GAME_STATE } from "../constants.js";
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

            const cell = this.board.get(Number(element.dataset.x), Number(element.dataset.y));
            this.input.handlePointerDown(cell, event);
        });
        this.boardElement.addEventListener("pointerup", event => {
            this.input.handlePointerUp(event);
        });
        this.boardElement.addEventListener("pointercancel", () => {
            this.input.handlePointerCancel();
        });
    }

    start() {
        document.getElementById("start-button").addEventListener("click", () => {
            this.startGame();
        });
        document.getElementById("restart-button").addEventListener("click", () => {
            this.restartGame();
        });
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
            } else {
                await this._handleMatch3Swap(cellA, cellB, elA, elB);
            }
        } finally {
            this.isBusy = false;
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

        await EffectAnimation.play(a.effect, affected, this);

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
        } else {
            this.score.startMove(this.board.countOwners());
            this.render();
            await this.resolver.resolve([cellA, cellB]);
        }
    }

    render({ hideEmpty = false } = {}) {
        const elements = [];
        const reused = [];

        for (let y = 0; y < this.board.size; y++) {
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
                elements.push(element);
            }
        }

        this.boardElement.replaceChildren(...elements);

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

                logo.setAttribute("role", "img");
                logo.setAttribute("aria-label", tile.name);
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
        this.state = GAME_STATE.PLAYING;
        this.startOverlay.classList.add("hidden");
        this.board = new Board(BOARD_SIZE);
        this.score.reset();
        this.fillBoard();
        this.checkGameOver();
        this.render();
    }

    restartGame() {
        this.gameOverOverlay.classList.add("hidden");
        this.startGame();
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        this.score.saveBest();
        this.hud.renderGameOver();
        this.hud.update();
        this.gameOverOverlay.classList.remove("hidden");
    }
}
