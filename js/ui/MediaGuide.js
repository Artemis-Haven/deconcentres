import { INFO_UPDATED } from "../constants.js";
import { MEDIA_CATALOG, OTHER_OWNERS } from "../mediaCatalog.js";
import { trackEvent } from "../analytics.js";

// Tracking par onglet
const TAB_EVENTS = {
    "guide-tab-owners": ["guide-milliardaires", "Guide : les milliardaires"],
    "guide-tab-independents": ["guide-independants", "Guide : les médias indépendants"]
};

// Pop-in guide des médias (milliardaires / indépendants)
export class MediaGuide {

    constructor() {
        this.dialog = document.getElementById("guide-dialog");
        this.tabs = [...this.dialog.querySelectorAll('[role="tab"]')];

        this.renderOwners(document.getElementById("guide-owners"));
        this.renderIndependents(document.getElementById("guide-independents"));

        for (const tab of this.tabs) {
            tab.addEventListener("click", () => this.showTab(tab));
        }

        // Ouverture directe sur un onglet
        for (const button of document.querySelectorAll("[data-guide-tab]")) {
            button.addEventListener("click", () => {
                this.selectTab(document.getElementById(`guide-tab-${button.dataset.guideTab}`));
            });
        }

        // Navigation clavier entre onglets
        this.dialog.querySelector('[role="tablist"]').addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

            const index = this.tabs.indexOf(document.activeElement);
            const next = this.tabs[(index + (event.key === "ArrowRight" ? 1 : -1) + this.tabs.length) % this.tabs.length];

            this.showTab(next);
            next.focus();
        });

        // Tracking de l'onglet affiché à l'ouverture
        document.addEventListener("click", event => {
            if (event.target.closest('[data-open="guide-dialog"]')) {
                this.trackTab(this.tabs.find(tab => tab.getAttribute("aria-selected") === "true"));
            }
        });

        document.getElementById("guide-close").addEventListener("click", () => {
            this.dialog.close();
        });

        // Clic sur le backdrop : fermeture
        this.dialog.addEventListener("click", event => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });
    }

    // Changement d'onglet (tracké si l'onglet change)
    showTab(tab) {
        if (tab.getAttribute("aria-selected") !== "true") {
            this.trackTab(tab);
        }

        this.selectTab(tab);
    }

    trackTab(tab) {
        const [name, title] = TAB_EVENTS[tab?.id] ?? [];

        if (name) trackEvent(name, title);
    }

    selectTab(selected) {
        for (const tab of this.tabs) {
            const isSelected = tab === selected;

            tab.setAttribute("aria-selected", String(isSelected));
            tab.tabIndex = isSelected ? 0 : -1;
            document.getElementById(tab.getAttribute("aria-controls")).hidden = !isSelected;
        }

        this.dialog.scrollTop = 0;
    }

    renderOwners(panel) {
        const owners = Object.entries(MEDIA_CATALOG).filter(([, catalog]) => catalog.owner);

        panel.innerHTML = `
            <p class="guide-intro">
                Une grande partie des principaux médias français appartient à une poignée de milliardaires,
                dont la fortune vient le plus souvent d'ailleurs : luxe, BTP, transport maritime…
                Posséder un média, c'est pouvoir peser sur ce dont on parle et sur la façon d'en parler :
                quels sujets sont mis en avant, lesquels sont passés sous silence, quelles idées ont droit de cité.
            </p>
            <div class="guide-maps">
                <a class="guide-map" href="https://www.monde-diplomatique.fr/cartes/PPA" target="_blank" rel="noopener">
                    <img class="guide-map-preview" src="./assets/carte-acrimed-monde-diplo.jpg" width="300" height="224" alt="">
                    <span class="guide-map-text">
                        <strong>Médias français, qui possède quoi&nbsp;? <span aria-hidden="true">↗</span><span class="visually-hidden"> (nouvel onglet)</span></strong>
                        <span>La carte complète, par Le Monde diplomatique et Acrimed</span>
                    </span>
                </a>
                <a class="guide-map" href="https://lvsl.fr/carte-de-ledition-francaise/" target="_blank" rel="noopener">
                    <span class="guide-map-preview guide-map-figure" aria-hidden="true">90&nbsp;%</span>
                    <span class="guide-map-text">
                        <strong>Et dans le milieu de l'édition&nbsp;? <span aria-hidden="true">↗</span><span class="visually-hidden"> (nouvel onglet)</span></strong>
                        <em>« 90 % de la production éditoriale est ainsi aux mains d'une poignée de grandes fortunes
                        plus ou moins liées à des intérêts industriels ou financiers. »</em>
                        <span>Carte de l'édition française, par Le Vent Se Lève et les éditions Agone, avec le Monde Diplomatique</span>
                    </span>
                </a>
            </div>` + owners.map(([color, catalog]) => `
            <section class="guide-owner tile-${color}">
                <div class="guide-owner-head">
                    <span class="guide-owner-mark" aria-hidden="true"></span>
                    <div>
                        <h3>${catalog.owner}</h3>
                        <p class="guide-owner-group">${catalog.group ?? ""}</p>
                    </div>
                </div>
                <p>${catalog.presentation ?? ""}</p>
                <dl class="guide-empire">
                    ${(catalog.empire ?? []).map(entry => `
                        <div>
                            <dt>${entry.category}</dt>
                            <dd>${entry.media}</dd>
                        </div>`).join("")}
                </dl>
            </section>`).join("") + `
            <section class="guide-others">
                <h3>Et aussi…</h3>
                <ul>
                    ${OTHER_OWNERS.map(other => `
                        <li>
                            <strong>${other.owner}</strong>
                            <span class="guide-others-group">${other.group}</span>
                            <p>${other.media}</p>
                        </li>`).join("")}
                </ul>
            </section>
            <p class="guide-note">
                Informations vérifiées en ${INFO_UPDATED}. Les rachats sont fréquents :
                certaines données peuvent avoir évolué.
            </p>`;
    }

    renderIndependents(panel) {
        const intro = document.createElement("p");
        intro.className = "guide-intro";
        intro.textContent = "Ces médias n'appartiennent à aucun milliardaire. " +
            "Pour les soutenir : abonne-toi, fais un don, partage leurs enquêtes.";

        const grid = document.createElement("div");
        grid.className = "guide-cards";

        const items = [...MEDIA_CATALOG.green.items]
            .sort((a, b) => a.name.localeCompare(b.name, "fr", { sensitivity: "base" }));

        for (const item of items) {
            grid.appendChild(this.createCard(item));
        }

        const more = document.createElement("p");
        more.className = "guide-more";
        more.textContent = "Et bien d'autres…";

        panel.replaceChildren(intro, grid, more);
    }

    createCard(item) {
        const card = document.createElement("article");
        card.className = "guide-card";

        // Même rendu que sur la grille
        const logoBox = document.createElement("div");
        logoBox.className = `guide-logo indep-square`;
        logoBox.setAttribute("aria-hidden", "true");

        if (item.logo) {
            logoBox.classList.add("has-logo", `logo--plain`);
            logoBox.classList.toggle("logo--wide", Boolean(item.logo.wide));

            if (item.logo.size) {
                logoBox.style.setProperty("--logo-size", `${item.logo.size}%`);
            }

            const logo = document.createElement("div");
            logo.className = "cell-logo";
            logo.style.backgroundImage = `url('./assets/${item.img}')`;
            logoBox.appendChild(logo);
        } else {
            // Pas de logo : on affiche le nom
            const name = document.createElement("span");
            name.className = "guide-logo-name";
            name.textContent = item.name;
            logoBox.appendChild(name);
        }

        const title = document.createElement("h4");
        title.textContent = item.name;

        const description = document.createElement("p");
        description.className = "guide-card-description";
        description.textContent = item.description ?? "";

        card.append(logoBox, title, description);

        if (item.highlight) {
            const highlight = document.createElement("p");
            highlight.className = "guide-card-highlight";
            highlight.textContent = item.highlight;
            card.appendChild(highlight);
        }

        if (item.url) {
            const link = document.createElement("a");
            link.className = "guide-card-link";
            link.href = item.url;
            link.target = "_blank";
            link.rel = "noopener";
            link.textContent = "Visiter le site ↗";
            link.setAttribute("aria-label", `Visiter le site de ${item.name} (nouvel onglet)`);
            card.appendChild(link);
        }

        return card;
    }
}
