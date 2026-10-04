import { Owner } from "../tiles/Owner.js";

export class IndependentEffects {

    static apply(effect, cell, game) {
        switch(effect) {
            case "cross":
                return this.cross(cell, game);
            case "square":
                return this.square(cell, game);
            case "dismantle":
                return this.dismantle(cell, game);
            default:
                return [];
        }
    }

    // -----------------------------
    // 1. Cross
    // Supprime tous les Owners ligne + colonne
    // -----------------------------
    static cross(cell, game) {

        const affected = [];

        const x0 = cell.x;
        const y0 = cell.y;

        // ligne
        for (let x = 0; x < game.board.size; x++) {

            const c = game.board.get(x, y0);

            if (c.tile instanceof Owner) {
                affected.push(c);
            }
        }

        // colonne
        for (let y = 0; y < game.board.size; y++) {

            const c = game.board.get(x0, y);

            if (c.tile instanceof Owner) {
                affected.push(c);
            }
        }

        return affected;
    }

    // -----------------------------
    // 2. Square
    // zone 3x3 centrée
    // -----------------------------
    static square(cell, game) {

        const affected = [];

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {

                const c = game.board.get(cell.x + dx, cell.y + dy);

                if (!c) continue;

                if (c.tile) {
                    affected.push(c);
                }
            }
        }

        return affected;
    }

    // -----------------------------
    // 3. Démantèlement
    // Supprime tous les Owners du groupe le plus présent sur le plateau.
    // En cas d'égalité, on démantèle le groupe dont un Owner est
    // le plus proche de la paire activée
    // -----------------------------
    static dismantle(cell, game) {

        const ownersByName = new Map();

        for (let y = 0; y < game.board.size; y++) {
            for (let x = 0; x < game.board.size; x++) {

                const c = game.board.get(x, y);

                if (c.tile instanceof Owner) {
                    if (!ownersByName.has(c.tile.name)) {
                        ownersByName.set(c.tile.name, []);
                    }

                    ownersByName.get(c.tile.name).push(c);
                }
            }
        }

        const distanceTo = c => Math.abs(c.x - cell.x) + Math.abs(c.y - cell.y);
        const closestDistance = cells => Math.min(...cells.map(distanceTo));

        let target = [];

        for (const cells of ownersByName.values()) {
            if (
                cells.length > target.length ||
                (cells.length === target.length && closestDistance(cells) < closestDistance(target))
            ) {
                target = cells;
            }
        }

        return target;
    }
}