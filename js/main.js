import { Game } from "./game/Game.js";
import { RulesModal } from "./ui/RulesModal.js";
import { MediaGuide } from "./ui/MediaGuide.js";

window.addEventListener("DOMContentLoaded", () => {

    const game = new Game();

    game.start();

    new RulesModal();
    new MediaGuide();

    // Tout bouton data-open="<id>" ouvre la pop-in correspondante
    document.addEventListener("click", event => {
        const button = event.target.closest("[data-open]");

        if (button) {
            document.getElementById(button.dataset.open)?.showModal();
        }
    });

});