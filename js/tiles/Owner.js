import { Tile } from "./Tile.js";
import { TILE_TYPE } from "../constants.js";

export class Owner extends Tile {

    constructor(name, color) {

        super(TILE_TYPE.OWNER, name, color);
    }
}