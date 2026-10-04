import { COLORS, INDEPENDENT_MEDIA_SPAWN_RATE } from "../constants.js";
import { Media } from "../tiles/Media.js";
import { MEDIA_CATALOG } from "../mediaCatalog.js";

export class Factory {

    static getRandomMedia(game, color = null, board = null, column = null) {
        color = color ?? this.getRandomColor();

        if (color === 'green') {
            return this.getIndependentMedia(game.independentPool, board, column);
        }
        const catalog = MEDIA_CATALOG[color];

        const item =
            catalog.items[
                Math.floor(Math.random() * catalog.items.length)
            ];

        return new Media(color, item);
    }

    static randomMediaSafe(board, x, y, game) {

        const cell = board.get(x, y);

        for (let tries = 0; tries < 10; tries++) {

            // Vider la case : une tuile rejetée ne doit pas compter
            // dans la pondération des médias indépendants
            cell.tile = null;

            const media = this.getRandomMedia(game, null, board, x);

            // Les médias indépendants ne forment jamais d'alignement
            if (media.isIndependent() || !board.hasMatchAt(x, y, media.color)) {
                return media;
            }
        }

        // Repli : une couleur qui ne crée pas d'alignement à cet endroit
        const safeColor = COLORS
            .filter(color => color !== "green")
            .sort(() => Math.random() - 0.5)
            .find(color => !board.hasMatchAt(x, y, color));

        return safeColor
            ? this.getRandomMedia(game, safeColor)
            : this.getIndependentMedia(game.independentPool, board, x);
    }

    static getOwnerName(color) {
        return MEDIA_CATALOG[color]?.owner || null;
    }

    static getIndependentMedia(pool, board = null, column = null) {

        if (!board || column === null) {
            const item = pool[Math.floor(Math.random() * pool.length)];
            return new Media("green", item);
        }

        const nearbyMediaCounts = new Map();

        for (let x = Math.max(0, column - 1); x <= Math.min(board.size - 1, column + 1); x++) {
            for (let y = 0; y < board.size; y++) {
                const tile = board.get(x, y).tile;

                if (tile?.isIndependent?.()) {
                    nearbyMediaCounts.set(
                        tile.name,
                        (nearbyMediaCounts.get(tile.name) || 0) + 1
                    );
                }
            }
        }

        const weightedPool = pool.flatMap(item => {
            const nearbyCount = nearbyMediaCounts.get(item.name) || 0;
            const weight = 1 + nearbyCount * 3;

            return Array(weight).fill(item);
        });

        const item = weightedPool[Math.floor(Math.random() * weightedPool.length)];

        return new Media("green", item);
    }

    static getRandomColor() {
        if (Math.random() < INDEPENDENT_MEDIA_SPAWN_RATE) {
            return "green";
        }
        const otherColors = COLORS.filter(c => c !== 'green');
        return otherColors[Math.floor(Math.random() * otherColors.length)];
    }
}
