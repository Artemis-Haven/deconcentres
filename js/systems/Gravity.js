import { Factory } from "../game/Factory.js";
import { Animation } from "./Animation.js";

export class Gravity {

    static async apply(board, game) {

        const previousPositions = this.getTilePositions(board, game);

        for (let x = 0; x < board.size; x++) {

            let stack = [];

            for (let y = board.size - 1; y >= 0; y--) {

                const cell = board.get(x, y);

                if (cell.tile) {
                    stack.push(cell.tile);
                }
            }

            for (let y = board.size - 1; y >= 0; y--) {

                const cell = board.get(x, y);

                const newTile = stack.shift();

                if (newTile) {
                    cell.tile = newTile;
                    continue;
                }

                const spawnedTile = Factory.getRandomMedia(game, null, board, cell.x);
                const position = game
                    .getCellElement(cell.x, cell.y)
                    .getBoundingClientRect();

                previousPositions.set(spawnedTile, {
                    left: position.left,
                    top: position.top - (cell.y + 1) * position.height
                });

                cell.tile = spawnedTile;
            }
        }

        game.render();
        await Animation.fall(board, game, previousPositions);
    }

    static getTilePositions(board, game) {
        const positions = new Map();

        for (let y = 0; y < board.size; y++) {
            for (let x = 0; x < board.size; x++) {
                const cell = board.get(x, y);

                if (!cell.tile) continue;

                const position = game
                    .getCellElement(x, y)
                    .getBoundingClientRect();

                positions.set(cell.tile, position);
            }
        }

        return positions;
    }
}
