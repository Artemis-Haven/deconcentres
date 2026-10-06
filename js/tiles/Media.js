import { Tile } from "./Tile.js";
import { TILE_TYPE } from "../constants.js";

export class Media extends Tile {

    constructor(color, data) {

        super(TILE_TYPE.MEDIA, data.name, color);

        this.img = data.img;

        // Nom court affiché sur la tuile (\n = retour à la ligne)
        this.shortName = data.shortName || null;

        this.effect = data.effect || null;

        // Options du logo (null = image provisoire) :
        // style: plain | plate (fond blanc) | white (passé en blanc)
        // wide: logo large, size: taille en %, showName: affiche aussi le nom
        this.logo = data.logo || null;
    }

    isIndependent() {
        return this.color === "green";
    }
}