import { Game } from "./game/Game.js";
import { RulesModal } from "./ui/RulesModal.js";

window.addEventListener("DOMContentLoaded", () => {

    const game = new Game();

    game.start();

    new RulesModal();

});