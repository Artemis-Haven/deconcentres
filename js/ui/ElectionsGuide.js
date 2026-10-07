import { ELECTIONS_BLOCK_ENABLED, INFO_UPDATED } from "../constants.js";
import { ORIENTATIONS, PARTIES } from "../elections.js";
import { trackEvent } from "../analytics.js";

// Bloc et pop-in élections (temporaire)
export class ElectionsGuide {

    constructor() {
        if (!ELECTIONS_BLOCK_ENABLED) return;

        document.getElementById("elections-entry").hidden = false;
        document.getElementById("gameover-elections").hidden = false;

        this.dialog = document.getElementById("elections-dialog");
        this.render(document.getElementById("elections-content"));

        document.addEventListener("click", event => {
            if (event.target.closest('[data-open="elections-dialog"]')) {
                trackEvent("propositions-partis", "Propositions des partis");
            }
        });

        document.getElementById("elections-close").addEventListener("click", () => {
            this.dialog.close();
        });

        // Clic sur le backdrop : fermeture
        this.dialog.addEventListener("click", event => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });
    }

    render(container) {
        const notice = document.createElement("p");
        notice.className = "elections-notice";
        notice.textContent = "Cette page sera complétée au fil des mois avec le contenu des programmes électoraux. " +
            "En attendant, elle s'appuie surtout sur des propositions de loi et des travaux parlementaires.";

        const intro = document.createElement("p");
        intro.className = "elections-intro";
        intro.textContent = "Propositions publiques des principaux partis sur la concentration des médias, " +
            `l'indépendance des rédactions et l'audiovisuel public, relevées en ${INFO_UPDATED}.`;

        const legend = document.createElement("p");
        legend.className = "elections-legend";
        legend.innerHTML = '<span class="elections-legend-mark"></span>' +
            "En vert : les propositions explicitement en faveur de la lutte contre la concentration des médias " +
            "ou de l'indépendance des rédactions.";

        const list = document.createElement("div");
        list.className = "elections-parties";

        for (const party of PARTIES) {
            list.appendChild(this.createParty(party));
        }

        container.replaceChildren(notice, intro, legend, this.createOrientationLegend(), list);
    }

    // Puce d'orientation
    createOrientationDot(orientation) {
        const dot = document.createElement("span");
        dot.className = "elections-orientation";
        dot.style.background = orientation.color;
        dot.title = orientation.label;
        dot.setAttribute("role", "img");
        dot.setAttribute("aria-label", `Orientation : ${orientation.label}`);

        return dot;
    }

    // Légende des orientations utilisées
    createOrientationLegend() {
        const used = new Set(PARTIES.map(party => party.orientation));
        const legend = document.createElement("ul");
        legend.className = "elections-orientations";

        for (const [key, orientation] of Object.entries(ORIENTATIONS)) {
            if (!used.has(key)) continue;

            const item = document.createElement("li");
            const dot = document.createElement("span");
            dot.className = "elections-orientation";
            dot.style.background = orientation.color;
            dot.setAttribute("aria-hidden", "true");

            item.append(dot, orientation.label);
            legend.appendChild(item);
        }

        return legend;
    }

    createParty(party) {
        const card = document.createElement("article");
        card.className = "elections-party";

        const title = document.createElement("h3");
        title.className = "elections-party-name";

        const orientation = ORIENTATIONS[party.orientation];

        if (orientation) {
            title.appendChild(this.createOrientationDot(orientation));
        }

        title.append(party.name);

        const proposals = document.createElement("ul");
        proposals.className = "elections-proposals";

        if (party.proposals.length === 0) {
            const none = document.createElement("li");
            none.className = "elections-none";
            none.textContent = "Aucune proposition identifiée";
            proposals.appendChild(none);
        }

        for (const proposal of party.proposals) {
            const item = document.createElement("li");
            item.className = "elections-proposal";
            item.classList.toggle("elections-proposal--concentration", Boolean(proposal.fightsConcentration));
            item.textContent = proposal.text;
            proposals.appendChild(item);
        }

        card.append(title, proposals);

        if (party.sources.length > 0) {
            const sources = document.createElement("p");
            sources.className = "elections-sources";
            sources.append("Sources : ");

            party.sources.forEach((source, index) => {
                const link = document.createElement("a");
                link.href = source.url;
                link.target = "_blank";
                link.rel = "noopener";
                link.textContent = source.label;
                sources.append(index > 0 ? " · " : "", link);
            });

            card.appendChild(sources);
        }

        return card;
    }
}
