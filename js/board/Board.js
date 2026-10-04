import { BOARD_SIZE } from "../constants.js";
import { Cell } from "./Cell.js";

export class Board {

    constructor(size = BOARD_SIZE) {

        this.size = size;
        this.cells = [];

        for (let y = 0; y < size; y++) {

            const row = [];

            for (let x = 0; x < size; x++) {
                row.push(new Cell(x, y));
            }

            this.cells.push(row);
        }
    }

    get(x, y) {

        if (
            x < 0 ||
            y < 0 ||
            x >= this.size ||
            y >= this.size
        ) return null;

        return this.cells[y][x];
    }

    swap(cellA, cellB) {

        const temp = cellA.tile;
        cellA.tile = cellB.tile;
        cellB.tile = temp;
    }

    countOwners() {
        return this.cells.flat().filter(cell => cell.tile?.isOwner?.()).length;
    }

    hasMatchAt(x, y, color) {

        // horizontal check
        let count = 1;

        for (let i = x - 1; i >= 0; i--) {
            const tile = this.get(i, y).tile;
            if (!tile?.isMedia?.() || tile.color !== color) break;
            count++;
        }

        for (let i = x + 1; i < this.size; i++) {
            const tile = this.get(i, y).tile;
            if (!tile?.isMedia?.() || tile.color !== color) break;
            count++;
        }

        if (count >= 3) return true;

        // vertical check
        count = 1;

        for (let i = y - 1; i >= 0; i--) {
            const tile = this.get(x, i).tile;
            if (!tile?.isMedia?.() || tile.color !== color) break;
            count++;
        }

        for (let i = y + 1; i < this.size; i++) {
            const tile = this.get(x, i).tile;
            if (!tile?.isMedia?.() || tile.color !== color) break;
            count++;
        }

        return count >= 3;
    }
}