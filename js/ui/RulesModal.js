import { EFFECT_DESCRIPTIONS, INDEPENDENT_EFFECTS, INDEPENDENT_MEDIA_SPAWN_RATE, SCORE } from "../constants.js";
import { MEDIA_CATALOG } from "../mediaCatalog.js";

export class RulesModal {

    constructor() {
        this.dialog = document.getElementById("rules-dialog");

        document.getElementById("rules-content").innerHTML = this.buildContent();

        document.getElementById("rules-button").addEventListener("click", () => {
            this.dialog.showModal();
        });

        document.getElementById("rules-close").addEventListener("click", () => {
            this.dialog.close();
        });

        // Un clic sur le fond (en dehors de la boîte) ferme la pop-in
        this.dialog.addEventListener("click", event => {
            if (event.target === this.dialog) {
                this.dialog.close();
            }
        });
    }

    buildContent() {
        return [
            this.goalSection(),
            this.moveSection(),
            this.ownersSection(),
            this.independentsSection(),
            this.pointsSection(),
            this.multipliersSection(),
            this.endSection()
        ].join("");
    }

    goalSection() {
        return `
            <section>
                <h3>Le but</h3>
                <p>
                    Chaque alignement de médias fait grandir l'empire d'un milliardaire.
                    Impossible de jouer sans concentrer les médias : à toi de garder la grille
                    plurielle le plus longtemps possible, grâce aux médias indépendants.
                </p>
            </section>`;
    }

    moveSection() {
        return `
            <section>
                <h3>Jouer un coup</h3>
                <p>
                    Fais glisser une tuile vers une case voisine (horizontalement ou verticalement)
                    pour les échanger. L'échange n'est accepté que s'il crée un alignement de
                    3 médias ou plus de la même couleur ; sinon, les tuiles reviennent à leur place.
                </p>
            </section>`;
    }

    ownersSection() {
        const owners = Object.entries(MEDIA_CATALOG)
            .filter(([, catalog]) => catalog.owner)
            .map(([color, catalog]) => `
                <li>
                    <span class="rules-swatch" style="background:${color}"></span>
                    <strong>${catalog.owner}</strong> :
                    ${catalog.items.map(item => item.name).join(", ")}
                </li>`)
            .join("");

        return `
            <section>
                <h3>Les médias et leurs propriétaires</h3>
                <ul class="rules-list">${owners}</ul>
                <p>
                    Quand un alignement se forme, ses médias disparaissent et sont remplacés par
                    <strong>un bloc noir « propriétaire »</strong>, placé à l'endroit de l'échange
                    (ou au milieu du groupe pour les alignements qui se forment tout seuls).
                    Les propriétaires restent sur la grille et tombent avec les autres tuiles.
                    On peut les déplacer, mais ils ne forment jamais d'alignement.
                </p>
                <p>
                    Les cases vidées sont remplies par de nouvelles tuiles qui tombent du haut,
                    ce qui peut provoquer de nouveaux alignements en cascade.
                </p>
            </section>`;
    }

    independentsSection() {
        const effects = INDEPENDENT_EFFECTS
            .map(effect => {
                const description = EFFECT_DESCRIPTIONS[effect];
                const media = MEDIA_CATALOG.green.items
                    .filter(item => item.effect === effect)
                    .map(item => item.name)
                    .join(" et ");

                return `<li><strong>${media}</strong> : ${description.toLowerCase()}.</li>`;
            })
            .join("");

        const spawnRate = Math.round(INDEPENDENT_MEDIA_SPAWN_RATE * 100);

        return `
            <section>
                <h3>Les médias indépendants</h3>
                <p>
                    Les tuiles <span class="rules-green">vertes</span> sont des médias indépendants.
                    À chaque partie, 3 d'entre eux sont tirés au sort, un pour chaque effet
                    (ils sont listés dans le bloc de gauche). Environ ${spawnRate} % des nouvelles tuiles sont des indépendants,
                    et un indépendant a plus de chances d'apparaître s'il y en a déjà un identique
                    dans les colonnes voisines.
                </p>
                <p>
                    Les indépendants ne s'alignent jamais. Pour en activer un, fais-le glisser sur
                    <strong>un indépendant identique</strong> juste à côté : les deux tuiles
                    disparaissent et déclenchent leur effet. Deux indépendants différents ne
                    peuvent pas être échangés.
                </p>
                <ul class="rules-list">${effects}</ul>
                <p>
                    Le démantèlement vise le milliardaire qui a le plus de blocs sur la grille.
                    En cas d'égalité, c'est celui dont un bloc est le plus proche de la paire activée.
                </p>
            </section>`;
    }

    pointsSection() {
        const { MATCH_POINTS } = SCORE;
        const ownerSteps = [1, 2, 3]
            .map(index => this.formatNumber(SCORE.OWNER_REMOVED_STEP * index))
            .join(", ");

        return `
            <section>
                <h3>Les points</h3>
                <table class="rules-table">
                    <tr><td>Alignement de 3</td><td>${MATCH_POINTS[3]}</td></tr>
                    <tr><td>Alignement de 4</td><td>${MATCH_POINTS[4]}</td></tr>
                    <tr><td>Alignement de 5 ou plus</td><td>${MATCH_POINTS[5]}</td></tr>
                    <tr><td>Bonus forme en L ou en T</td><td>+${SCORE.SHAPE_BONUS}</td></tr>
                    <tr><td>Activation d'une paire d'indépendants</td><td>${SCORE.INDEPENDENT_ACTIVATION}</td></tr>
                    <tr><td>Chaque propriétaire retiré</td><td>${ownerSteps}…</td></tr>
                    <tr><td>Chaque média détruit par une explosion</td><td>${SCORE.MEDIA_DESTROYED}</td></tr>
                </table>
                <p>
                    Les points par propriétaire retiré augmentent à chaque propriétaire retiré
                    dans le même coup : plus on en fait tomber d'un coup, plus ça rapporte.
                </p>
            </section>`;
    }

    multipliersSection() {
        let minOwners = 0;

        const tiers = SCORE.PLURALISM
            .map(tier => {
                const range = tier.maxOwners === Infinity
                    ? `${minOwners} et plus`
                    : `${minOwners} à ${tier.maxOwners}`;

                minOwners = tier.maxOwners + 1;

                return `<tr><td>${range} propriétaires</td><td>×${this.formatNumber(tier.multiplier)}</td></tr>`;
            })
            .join("");

        return `
            <section>
                <h3>Les multiplicateurs</h3>
                <p>
                    <strong>Indice de pluralisme</strong> : il dépend du nombre de propriétaires
                    sur la grille au début du coup, et s'applique à tous les points du coup.
                </p>
                <table class="rules-table">${tiers}</table>
                <p>
                    <strong>Cascades</strong> : l'alignement créé par ton échange vaut ×1,
                    les alignements qui se forment ensuite en cascade valent ×2, puis ×3, etc.
                </p>
                <p>
                    <strong>Série indépendante</strong> : si tu actives une paire d'indépendants
                    dans les ${SCORE.SERIES_WINDOW} coups qui suivent la précédente activation,
                    ses points sont multipliés par ${this.formatNumber(SCORE.SERIES_MULTIPLIER)}.
                </p>
            </section>`;
    }

    endSection() {
        return `
            <section>
                <h3>Fin de partie</h3>
                <p>
                    La partie s'arrête quand plus aucun coup n'est possible. Un bilan affiche
                    ton score, le nombre de médias rachetés par chaque milliardaire et le nombre
                    de rédactions libérées par les médias indépendants. Ton meilleur score est
                    conservé comme record.
                </p>
            </section>`;
    }

    formatNumber(value) {
        return value.toLocaleString("fr-FR");
    }
}
