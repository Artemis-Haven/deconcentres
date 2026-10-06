import { EFFECT_DESCRIPTIONS, EFFECT_NAMES, INDEPENDENT_EFFECTS, SCORE } from "../constants.js";
import { MEDIA_CATALOG } from "../mediaCatalog.js";
import { Score } from "../systems/Score.js";
import { createEffectBadge } from "./icons.js";

export class Hud {

    constructor(game) {
        this.game = game;

        this.scoreElement = document.getElementById("score");
        this.bestElement = document.getElementById("best-score");
        this.pluralismElement = document.getElementById("pluralism");
        this.ownerCountElement = document.getElementById("owner-count");
        this.seriesElement = document.getElementById("series");
        this.independentsElement = document.getElementById("independents");
        this.statsElement = document.getElementById("gameover-stats");

        // Mobile et tablette : résumé des bonus et détail à déplier
        this.sidebarElement = document.getElementById("sidebar");
        this.summaryButton = document.getElementById("bonus-summary");
        this.pluralismSummary = document.getElementById("pluralism-summary");
        this.seriesSummary = document.getElementById("series-summary");
        this.listenToSummary();

        this.renderIndependents();
    }

    update() {
        const score = this.game.score;
        const ownerCount = this.game.board.countOwners();
        const multiplier = Score.getPluralismMultiplier(ownerCount);
        const tierIndex = SCORE.PLURALISM.findIndex(tier => tier.multiplier === multiplier);

        this.scoreElement.textContent = this.formatNumber(score.total);
        this.bestElement.textContent = this.formatNumber(score.best);

        this.pluralismElement.textContent = `×${this.formatNumber(multiplier)}`;
        this.pluralismElement.dataset.tier = tierIndex;
        this.ownerCountElement.textContent = ownerCount;

        const movesLeft = score.seriesMovesLeft();
        this.seriesElement.textContent = movesLeft > 0
            ? `Active : ${movesLeft} coup${movesLeft > 1 ? "s" : ""} pour enchaîner (×${this.formatNumber(SCORE.SERIES_MULTIPLIER)})`
            : "Aucune série en cours";
        this.seriesElement.classList.toggle("is-active", movesLeft > 0);

        this.pluralismSummary.textContent = this.pluralismElement.textContent;
        this.pluralismSummary.dataset.tier = tierIndex;
        this.seriesSummary.textContent = movesLeft > 0
            ? `Série : ${movesLeft} coup${movesLeft > 1 ? "s" : ""}`
            : "Aucune série";
        this.seriesSummary.classList.toggle("is-active", movesLeft > 0);
    }

    // Le détail des bonus s'ouvre par-dessus la grille, et se ferme au toucher
    // en dehors, avec Échap ou en touchant de nouveau le résumé
    listenToSummary() {
        this.summaryButton.addEventListener("click", () => {
            this.setDetailsOpen(!this.sidebarElement.classList.contains("is-open"));
        });

        document.addEventListener("pointerdown", event => {
            if (
                this.sidebarElement.classList.contains("is-open") &&
                !this.sidebarElement.contains(event.target) &&
                !this.summaryButton.contains(event.target)
            ) {
                this.setDetailsOpen(false);
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                this.setDetailsOpen(false);
            }
        });
    }

    setDetailsOpen(open) {
        this.sidebarElement.classList.toggle("is-open", open);
        this.summaryButton.setAttribute("aria-expanded", String(open));
    }

    // Les 3 effets des médias indépendants
    renderIndependents() {
        this.independentsElement.innerHTML = "";

        for (const effect of INDEPENDENT_EFFECTS) {
            const li = document.createElement("li");
            const icon = createEffectBadge(effect, "independent-icon");

            const name = document.createElement("strong");
            name.textContent = EFFECT_NAMES[effect];

            const description = document.createElement("span");
            description.textContent = EFFECT_DESCRIPTIONS[effect];

            li.append(icon, name, description);
            this.independentsElement.appendChild(li);
        }
    }

    // Affiche « +N » au-dessus d'une case
    showPoints(cell, points) {
        const cellElement = this.game.getCellElement(cell.x, cell.y);

        if (!cellElement || points <= 0) return;

        const rect = cellElement.getBoundingClientRect();
        const float = document.createElement("div");

        float.className = "score-float";
        float.setAttribute("aria-hidden", "true");
        float.textContent = `+${this.formatNumber(points)}`;
        float.style.left = `${rect.left + rect.width / 2}px`;
        float.style.top = `${rect.top + rect.height / 2}px`;

        document.body.appendChild(float);
        float.addEventListener("animationend", () => float.remove());

        // Secours : l'animation ne se termine pas si l'onglet est en arrière-plan
        setTimeout(() => float.remove(), 1500);
    }

    renderGameOver() {
        const score = this.game.score;

        this.statsElement.innerHTML = "";

        const total = document.createElement("p");
        total.className = "gameover-score";
        total.textContent = `Score : ${this.formatNumber(score.total)}`;
        this.statsElement.appendChild(total);

        if (score.isNewBest) {
            const best = document.createElement("p");
            best.className = "gameover-best";
            best.textContent = "Nouveau record !";
            this.statsElement.appendChild(best);
        }

        const intro = document.createElement("p");
        intro.textContent = "Pendant ta partie :";
        this.statsElement.appendChild(intro);

        const list = document.createElement("ul");

        for (const { owner } of Object.values(MEDIA_CATALOG)) {
            if (!owner) continue;

            const count = score.ownersCreated[owner] || 0;
            const li = document.createElement("li");
            li.textContent = `${owner} a racheté ${count} média${count > 1 ? "s" : ""}`;
            list.appendChild(li);
        }

        this.statsElement.appendChild(list);

        const freed = document.createElement("p");
        freed.textContent = score.ownersRemoved > 0
            ? `Les médias indépendants ont libéré ${score.ownersRemoved} rédaction${score.ownersRemoved > 1 ? "s" : ""}.`
            : "Aucune rédaction n'a été libérée par les médias indépendants.";
        this.statsElement.appendChild(freed);

        this.renderGameOverInvitation();
    }

    // « Et dans la vraie vie ? » : cite le milliardaire qui a le plus racheté pendant la partie
    renderGameOverInvitation() {
        const created = this.game.score.ownersCreated;
        const top = Object.values(MEDIA_CATALOG)
            .filter(catalog => catalog.owner)
            .reduce((best, catalog) =>
                (created[catalog.owner] || 0) > (created[best.owner] || 0) ? catalog : best);
        const count = created[top.owner] || 0;
        const text = document.getElementById("gameover-more-text");

        if (count > 0) {
            text.innerHTML = `Pendant ta partie, <strong>${top.owner}</strong> a racheté ` +
                `${count} média${count > 1 ? "s" : ""}. Dans la réalité aussi, son groupe possède ` +
                `un véritable empire médiatique.`;
        } else {
            text.textContent = "Les médias de la grille existent vraiment : découvre qui les possède.";
        }
    }

    formatNumber(value) {
        return value.toLocaleString("fr-FR");
    }
}
