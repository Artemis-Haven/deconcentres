import { MEDIA_CATALOG, OTHER_OWNERS } from "../mediaCatalog.js";

// Pop-in « Qui possède nos médias ? » : un onglet pour les milliardaires,
// un onglet pour les médias indépendants, construits à partir du catalogue
export class MediaGuide {

    constructor() {
        this.dialog = document.getElementById("guide-dialog");
        this.tabs = [...this.dialog.querySelectorAll('[role="tab"]')];

        this.renderOwners(document.getElementById("guide-owners"));
        this.renderIndependents(document.getElementById("guide-independents"));

        for (const tab of this.tabs) {
            tab.addEventListener("click", () => this.selectTab(tab));
        }

        // Boutons data-guide-tab : ouvrent la pop-in directement sur l'onglet voulu
        for (const button of document.querySelectorAll("[data-guide-tab]")) {
            button.addEventListener("click", () => {
                this.selectTab(document.getElementById(`guide-tab-${button.dataset.guideTab}`));
            });
        }

        // Flèches gauche / droite pour passer d'un onglet à l'autre
        this.dialog.querySelector('[role="tablist"]').addEventListener("keydown", event => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

            const index = this.tabs.indexOf(document.activeElement);
            const next = this.tabs[(index + (event.key === "ArrowRight" ? 1 : -1) + this.tabs.length) % this.tabs.length];

            this.selectTab(next);
            next.focus();
        });

        document.getElementById("guide-close").addEventListener("click", () => {
            this.dialog.close();
        });

        // Un clic sur le fond (en dehors de la boîte) ferme la pop-in
        this.dialog.addEventListener("click", event => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });
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
            </p>` + owners.map(([color, catalog]) => `
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
                Informations vérifiées en octobre 2026. Les rachats sont fréquents :
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

        panel.replaceChildren(intro, grid);
    }

    createCard(item) {
        const card = document.createElement("article");
        card.className = "guide-card";

        // Même rendu du logo que sur la grille (classes et options du catalogue)
        const logoBox = document.createElement("div");
        logoBox.className = `guide-logo indep-square`;
        // Décoratif : le nom du média suit juste en dessous
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
            // Pas encore de vrai logo : le nom à la place
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

        // Fait d'armes ou ce qui a fait connaître le média
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
