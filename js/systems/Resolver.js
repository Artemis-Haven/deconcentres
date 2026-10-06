import { Animation } from "./Animation.js";
import { MatchFinder } from "./MatchFinder.js";
import { Gravity } from "./Gravity.js";
import { Owner } from "../tiles/Owner.js";
import { Factory } from "../game/Factory.js";

export class Resolver {

    constructor(game) {
        this.game = game;
    }

    async resolve(swappedCells = []) {
        let stabilized = false;
        let maxIterations = 100; // Limite pour éviter les boucles infinies
        let cascadeLevel = 0; // ×1 pour l'échange du joueur, ×2, ×3... pour les cascades

        while (!stabilized) {
            if (maxIterations-- <= 0) {
                throw new Error("La résolution a échoué à se stabiliser.");
            }

            const before = this.snapshot();
            cascadeLevel++;

            const matches = MatchFinder.find(this.game.board);
            if (matches.length > 0) {
                const ownerCells = await this.applyMatches(matches, swappedCells, cascadeLevel);
                this.game.render({ hideEmpty: true });

                await Animation.appear(
                    ownerCells.map(cell =>
                        this.game.getCellElement(cell.x, cell.y)
                    )
                );
            }

            await Gravity.apply(this.game.board, this.game);

            // Les cascades suivantes ne viennent plus du swap
            swappedCells = [];

            const after = this.snapshot();
            stabilized = this.isSame(before, after);
        }

        this.game.checkGameOver();
        this.game.render();
    }

    async applyMatches(groups, swappedCells = [], cascadeLevel = 1) {

        const ownerCells = [];

        for (const group of groups) {

            // Owner sur la case du swap, sinon au milieu du groupe
            const swappedCell = group.find(cell => swappedCells.includes(cell));
            const centerCell = swappedCell ?? group[Math.floor(group.length / 2)];

            const color = group[0].tile.color;
            const ownerName = Factory.getOwnerName(color);
            const owner = new Owner(ownerName, color);

            const points = this.game.score.scoreMatch(group, cascadeLevel, ownerName);
            this.game.hud.showPoints(centerCell, points);

            const elements = [];

            for (const cell of group) {

                const el = this.game.getCellElement(cell.x, cell.y);

                elements.push(el);

                cell.tile = null;
            }

            await Animation.pop(elements);

            centerCell.tile = owner;
            ownerCells.push(centerCell);
        }

        return ownerCells;
    }



    snapshot() {
        const board = this.game.board;
        const snap = [];

        for (let y = 0; y < board.size; y++) {
            const row = [];

            for (let x = 0; x < board.size; x++) {
                const tile = board.get(x, y).tile;
                row.push(tile ? tile.name : null);
            }

            snap.push(row);
        }

        return snap;
    }

    isSame(a, b) {
        for (let y = 0; y < a.length; y++) {
            for (let x = 0; x < a[y].length; x++) {

                if (a[y][x] !== b[y][x]) {
                    return false;
                }
            }
        }

        return true;
    }
}
