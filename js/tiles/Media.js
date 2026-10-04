import { Tile } from "./Tile.js";
import { TILE_TYPE } from "../constants.js";

export class Media extends Tile {

    constructor(color, data) {

        super(TILE_TYPE.MEDIA, data.name, color);

        this.img = data.img;

        this.effect = data.effect || null;
    }

    isIndependent() {
        return this.color === "green";
    }
}