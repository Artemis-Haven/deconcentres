import { Animation } from "./Animation.js";

export class EffectAnimation {

    static async play(effect, cells, game)
    {
        switch(effect)
        {
            case "cross":
                return this.cross(cells, game);

            case "square":
                return this.square(cells, game);

            case "dismantle":
                return this.dismantle(cells, game);
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

    static async cross(cells, game)
    {
        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.add("effect-cross");
        }

        await Animation.sleep(450);

        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.remove("effect-cross");
        }
    }

    static async square(cells, game)
    {
        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.add("effect-square");
        }

        await Animation.sleep(450);

        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.remove("effect-square");
        }
    }

    static async dismantle(cells, game)
    {
        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.add("effect-dismantle");
        }

        await Animation.sleep(450);

        for(const cell of cells) {
            game
                .getCellElement(cell.x,cell.y)
                .classList.remove("effect-dismantle");
        }
    }

}