import { Animation } from "./Animation.js";
import { EFFECT_ICONS } from "../ui/icons.js";

const SVG_NS = "http://www.w3.org/2000/svg";

// Effets visuels des médias indépendants. Ils sont dessinés sur un calque
// posé par-dessus la grille, puis les tuiles touchées disparaissent
export class EffectAnimation {

    static async play(effect, cells, game, origin)
    {
        const layer = this.createLayer(game);

        try {
            switch(effect)
            {
                case "cross":
                    return await this.cross(cells, game, origin, layer);

                case "square":
                    return await this.square(cells, game, origin, layer);

                case "dismantle":
                    return await this.dismantle(cells, game, origin, layer);
            }
        } finally {
            layer.remove();
        }
    }

    static async highlight(cells, game)
    {
        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.add("effect-highlight");
        }

        await Animation.sleep(350);

        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.remove("effect-highlight");
        }
    }

    // -----------------------------
    // Croisement des sources : deux faisceaux partent de la paire, le long
    // de la ligne et de la colonne ; chaque propriétaire touché s'illumine
    // -----------------------------
    static async cross(cells, game, origin, layer)
    {
        const center = this.cellRect(game, origin, layer);
        const { width, height } = layer.getBoundingClientRect();

        const horizontal = this.addElement(layer, "effect-beam effect-beam--horizontal");
        horizontal.style.top = `${center.cy}px`;
        horizontal.style.transformOrigin = `${center.cx}px 50%`;

        const vertical = this.addElement(layer, "effect-beam effect-beam--vertical");
        vertical.style.left = `${center.cx}px`;
        vertical.style.transformOrigin = `50% ${center.cy}px`;

        const burst = this.addElement(layer, "effect-burst");
        this.placeAt(burst, center.cx, center.cy, center.width * 1.2);

        // Le faisceau atteint chaque case selon sa distance à la paire
        const reach = Math.max(width, height);

        for (const cell of cells) {
            const rect = this.cellRect(game, cell, layer);
            const distance = Math.hypot(rect.cx - center.cx, rect.cy - center.cy);

            this.hit(game, cell, "effect-hit", (distance / reach) * 300);
        }

        await Animation.sleep(650);
        await this.vanish(cells, game);
    }

    // -----------------------------
    // Enquête : la zone de 3×3 est encadrée, une loupe la parcourt
    // et une ligne de lecture la balaie de haut en bas
    // -----------------------------
    static async square(cells, game, origin, layer)
    {
        const size = game.board.size;
        const topLeft = this.cellRect(game, {
            x: Math.max(origin.x - 1, 0),
            y: Math.max(origin.y - 1, 0)
        }, layer);
        const bottomRight = this.cellRect(game, {
            x: Math.min(origin.x + 1, size - 1),
            y: Math.min(origin.y + 1, size - 1)
        }, layer);

        const zone = this.addElement(layer, "effect-zone");
        zone.style.left = `${topLeft.left}px`;
        zone.style.top = `${topLeft.top}px`;
        zone.style.width = `${bottomRight.right - topLeft.left}px`;
        zone.style.height = `${bottomRight.bottom - topLeft.top}px`;
        this.addElement(zone, "effect-scan");

        const lens = this.addElement(zone, "effect-lens");
        lens.innerHTML = EFFECT_ICONS.square;

        // Les tuiles sont « révélées » au passage de la ligne de lecture
        const zoneHeight = bottomRight.bottom - topLeft.top;

        for (const cell of cells) {
            const rect = this.cellRect(game, cell, layer);

            this.hit(game, cell, "effect-reveal", 150 + ((rect.cy - topLeft.top) / zoneHeight) * 450);
        }

        await Animation.sleep(850);
        await this.vanish(cells, game);
    }

    // -----------------------------
    // Démantèlement : le réseau qui relie les propriétaires du groupe
    // se dessine, puis chaque lien se brise et les propriétaires tombent
    // -----------------------------
    static async dismantle(cells, game, origin, layer)
    {
        const svg = document.createElementNS(SVG_NS, "svg");
        svg.classList.add("effect-network");
        layer.appendChild(svg);

        const color = cells.length > 0
            ? getComputedStyle(game.getCellElement(cells[0].x, cells[0].y)).getPropertyValue("--tile")
            : "#fff";
        layer.style.setProperty("--network", color);

        const points = cells.map(cell => this.cellRect(game, cell, layer));
        const links = this.networkLinks(points);

        // Chaque lien est fait de deux moitiés, qui s'écartent quand il se brise
        links.forEach(([a, b], index) => {
            const middle = { cx: (a.cx + b.cx) / 2, cy: (a.cy + b.cy) / 2 };

            // Étincelle là où le lien se brise
            const spark = this.addElement(layer, "effect-burst effect-spark");
            this.placeAt(spark, middle.cx, middle.cy, a.width * .7);
            spark.style.animationDelay = `${450 + index * 30}ms`;

            for (const [from, to] of [[a, middle], [b, middle]]) {
                const line = document.createElementNS(SVG_NS, "line");
                line.setAttribute("x1", from.cx);
                line.setAttribute("y1", from.cy);
                line.setAttribute("x2", to.cx);
                line.setAttribute("y2", to.cy);
                line.setAttribute("pathLength", "1");
                line.classList.add("effect-link");
                line.style.animationDelay = `${index * 60}ms, ${450 + index * 30}ms`;
                svg.appendChild(line);
            }
        });

        for (const point of points) {
            const node = document.createElementNS(SVG_NS, "circle");
            node.setAttribute("cx", point.cx);
            node.setAttribute("cy", point.cy);
            node.setAttribute("r", point.width * .14);
            node.classList.add("effect-node");
            svg.appendChild(node);
        }

        cells.forEach(cell => this.hit(game, cell, "effect-break", 450));

        await Animation.sleep(900);
        await this.vanish(cells, game);
    }

    // Liens du réseau : chaque propriétaire est relié au plus proche
    // de ceux déjà reliés (arbre couvrant), pour un réseau lisible
    static networkLinks(points) {
        if (points.length < 2) return [];

        const linked = [points[0]];
        const remaining = points.slice(1);
        const links = [];

        while (remaining.length > 0) {
            let best = null;

            for (const candidate of remaining) {
                for (const anchor of linked) {
                    const distance = Math.hypot(candidate.cx - anchor.cx, candidate.cy - anchor.cy);

                    if (!best || distance < best.distance) {
                        best = { candidate, anchor, distance };
                    }
                }
            }

            links.push([best.anchor, best.candidate]);
            linked.push(best.candidate);
            remaining.splice(remaining.indexOf(best.candidate), 1);
        }

        return links;
    }

    // Les tuiles touchées disparaissent avant d'être retirées de la grille
    static async vanish(cells, game) {
        for (const cell of cells) {
            const element = game.getCellElement(cell.x, cell.y);

            if (!element) continue;

            element.style.animationDelay = "";
            element.classList.add("effect-vanish");
        }

        await Animation.sleep(250);
    }

    static hit(game, cell, className, delay) {
        const element = game.getCellElement(cell.x, cell.y);

        if (!element) return;

        element.style.animationDelay = `${Math.round(delay)}ms`;
        element.classList.add(className);
    }

    // Calque fixe aux dimensions de la grille, ignoré par les lecteurs d'écran
    static createLayer(game) {
        const rect = game.boardElement.getBoundingClientRect();
        const layer = document.createElement("div");

        layer.className = "effect-layer";
        layer.setAttribute("aria-hidden", "true");
        layer.style.left = `${rect.left}px`;
        layer.style.top = `${rect.top}px`;
        layer.style.width = `${rect.width}px`;
        layer.style.height = `${rect.height}px`;
        document.body.appendChild(layer);

        return layer;
    }

    static addElement(parent, className) {
        const element = document.createElement("div");
        element.className = className;
        parent.appendChild(element);

        return element;
    }

    static placeAt(element, cx, cy, size) {
        element.style.left = `${cx - size / 2}px`;
        element.style.top = `${cy - size / 2}px`;
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
    }

    // Position d'une case par rapport au calque
    static cellRect(game, cell, layer) {
        const rect = game.getCellElement(cell.x, cell.y).getBoundingClientRect();
        const origin = layer.getBoundingClientRect();
        const left = rect.left - origin.left;
        const top = rect.top - origin.top;

        return {
            left,
            top,
            right: left + rect.width,
            bottom: top + rect.height,
            width: rect.width,
            cx: left + rect.width / 2,
            cy: top + rect.height / 2
        };
    }
}
