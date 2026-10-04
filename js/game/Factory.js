import { COLORS, INDEPENDENT_MEDIA_SPAWN_RATE, INDEPENDENT_NEARBY_BOOST } from "../constants.js";
import { Media } from "../tiles/Media.js";
import { MEDIA_CATALOG } from "../mediaCatalog.js";

export class Factory {

    static getRandomMedia(color = null, board = null, column = null) {
        color = color ?? this.getRandomColor();

        if (color === 'green') {
            return this.getIndependentMedia(board, column);
        }
        const catalog = MEDIA_CATALOG[color];

        const item =
            catalog.items[
                Math.floor(Math.random() * catalog.items.length)
            ];

        return new Media(color, item);
    }

    static randomMediaSafe(board, x, y) {

        const cell = board.get(x, y);

        for (let tries = 0; tries < 10; tries++) {

            // Vider la case : une tuile rejetée ne doit pas compter
            // dans la pondération des médias indépendants
            cell.tile = null;

            const media = this.getRandomMedia(null, board, x);

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
            ? this.getRandomMedia(safeColor)
            : this.getIndependentMedia(board, x);
    }

    static getOwnerName(color) {
        return MEDIA_CATALOG[color]?.owner || null;
    }

    // Tire un média indépendant parmi tous ceux du catalogue.
    // Chaque effet pèse autant au total, quel que soit son nombre de médias,
    // et un effet déjà présent dans les colonnes voisines est favorisé
    static getIndependentMedia(board = null, column = null) {
        const items = MEDIA_CATALOG.green.items;
        const nearbyEffectCounts = this.countNearbyIndependents(board, column);

        const weights = items.map(item => {
            const sameEffectCount = items.filter(other => other.effect === item.effect).length;
            const nearbyCount = nearbyEffectCounts.get(item.effect) || 0;

            return (1 + nearbyCount * INDEPENDENT_NEARBY_BOOST) / sameEffectCount;
        });

        let draw = Math.random() * weights.reduce((sum, weight) => sum + weight, 0);
        const index = weights.findIndex(weight => (draw -= weight) < 0);

        // Repli sur le dernier en cas d'arrondi flottant
        return new Media("green", items[index === -1 ? items.length - 1 : index]);
    }

    // Nombre de médias indépendants de chaque effet dans la colonne et ses voisines
    static countNearbyIndependents(board, column) {
        const counts = new Map();

        if (!board || column === null) return counts;

        for (let x = Math.max(0, column - 1); x <= Math.min(board.size - 1, column + 1); x++) {
            for (let y = 0; y < board.size; y++) {
                const tile = board.get(x, y).tile;

                if (tile?.isIndependent?.()) {
                    counts.set(tile.effect, (counts.get(tile.effect) || 0) + 1);
                }
            }
        }

        return counts;
    }

    static getRandomColor() {
        if (Math.random() < INDEPENDENT_MEDIA_SPAWN_RATE) {
            return "green";
        }
        const otherColors = COLORS.filter(c => c !== 'green');
        return otherColors[Math.floor(Math.random() * otherColors.length)];
    }
}
