import { TILE_TYPE } from "../constants.js";

export class Tile {

    constructor(type, name, color) {
        this.type = type;
        this.name = name;
        this.color = color;
    }

    isMedia() {
        return this.type === TILE_TYPE.MEDIA;
    }

    isOwner() {
        return this.type === TILE_TYPE.OWNER;
    }
}