import { BOARD_SIZE, GAME_STATE, INDEPENDENT_EFFECTS } from "../constants.js";
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
import { MEDIA_CATALOG } from "../mediaCatalog.js";

export class Game {

    constructor() {
        this.board = new Board(BOARD_SIZE);
        this.input = new Input(this);
        this.boardElement = document.getElementById("board");
        this.resolver = new Resolver(this);
        this.independentPool = this.initIndependentPool();
        this.isBusy = false;
        this.state = GAME_STATE.READY;
        this.startOverlay = document.getElementById("start-overlay");
        this.gameOverOverlay = document.getElementById("gameover-overlay");
        this.score = new Score();
        this.hud = new Hud(this);
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
                    Factory.randomMediaSafe(this.board, x, y, this);
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
                // Deux indépendants différents : l'échange est refusé
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
        this.boardElement.innerHTML = "";
        for (let y = 0; y < this.board.size; y++) {
            for (let x = 0; x < this.board.size; x++) {
                const cell = this.board.get(x, y);
                const div = document.createElement("div");
                div.className = "cell";
                div.dataset.x = x;
                div.dataset.y = y;
                const tile = cell.tile;
                const inner = document.createElement("div");
                inner.className = "cell-inner";
                if (tile && tile.isMedia()) {
                    const logo = document.createElement("div");
                    logo.className = "cell-logo";
                    logo.style.backgroundImage = `url('./assets/${tile.img}')`;
                    const label = document.createElement("div");
                    label.className = "cell-label";
                    label.textContent = tile.name;
                    inner.appendChild(logo);
                    inner.appendChild(label);
                    div.classList.add(
                        tile.isIndependent() ? "cell--independent" : "cell--media",
                        `tile-${tile.color}`
                    );
                } else if (tile && tile.isOwner()) {
                    const owner = document.createElement("div");
                    owner.className = "cell-owner";
                    owner.textContent = tile.name;
                    inner.appendChild(owner);
                    div.classList.add("cell--owner", `tile-${tile.color}`);
                } else {
                    div.classList.add("empty-cell");

                    if (hideEmpty) {
                        div.classList.add("empty-cell-hidden");
                    }
                }
                div.appendChild(inner);
                div.addEventListener("pointerdown", event => {
                    this.input.handlePointerDown(cell, event);
                });
                div.addEventListener("pointerup", event => {
                    this.input.handlePointerUp(event);
                });
                div.addEventListener("pointercancel", () => {
                    this.input.handlePointerCancel();
                });
                this.boardElement.appendChild(div);
            }
        }

        this.hud.update();
    }

    getCellElement(x, y) {
        return this.boardElement.querySelector(
            `[data-x="${x}"][data-y="${y}"]`
        );
    }

    // Un média indépendant tiré au hasard pour chaque effet, dans l'ordre des effets
    initIndependentPool() {
        const greens = MEDIA_CATALOG.green.items;

        return INDEPENDENT_EFFECTS.map(effect => {
            const candidates = greens.filter(item => item.effect === effect);

            return candidates[Math.floor(Math.random() * candidates.length)];
        });
    }

    startGame() {
        this.state = GAME_STATE.PLAYING;
        this.startOverlay.classList.add("hidden");
        this.board = new Board(BOARD_SIZE);
        this.independentPool = this.initIndependentPool();
        this.score.reset();
        this.hud.renderIndependents();
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
