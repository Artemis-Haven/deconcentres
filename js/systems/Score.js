import { SCORE } from "../constants.js";

const BEST_SCORE_KEY = "monopoly-medias-best-score";

export class Score {

    constructor() {
        this.best = this.loadBest();
        this.reset();
    }

    reset() {
        this.total = 0;
        this.moveCount = 0;
        this.lastIndependentMove = null;
        this.pluralism = 1;
        this.ownersCreated = {};
        this.ownersRemoved = 0;
        this.isNewBest = false;
    }

    static getPluralismMultiplier(ownerCount) {
        return SCORE.PLURALISM.find(tier => ownerCount <= tier.maxOwners).multiplier;
    }

    // Appelé au début de chaque coup valide : fige l'indice de pluralisme du coup
    startMove(ownerCount) {
        this.moveCount++;
        this.pluralism = Score.getPluralismMultiplier(ownerCount);
    }

    isSeriesActive() {
        return this.lastIndependentMove !== null &&
            this.moveCount - this.lastIndependentMove <= SCORE.SERIES_WINDOW;
    }

    // Coups restants pour enchaîner une série (0 si aucune série en cours)
    seriesMovesLeft() {
        if (this.lastIndependentMove === null) return 0;

        return Math.max(0, SCORE.SERIES_WINDOW - (this.moveCount - this.lastIndependentMove));
    }

    scoreMatch(group, cascadeLevel, ownerName) {
        const size = Math.min(group.length, 5);
        let points = SCORE.MATCH_POINTS[size];

        if (!this.isStraightLine(group)) {
            points += SCORE.SHAPE_BONUS;
        }

        this.ownersCreated[ownerName] = (this.ownersCreated[ownerName] || 0) + 1;

        return this.add(points * cascadeLevel * this.pluralism);
    }

    // `affectedTiles` : les tuiles touchées par l'effet, avant leur suppression
    scoreIndependent(affectedTiles) {
        let points = SCORE.INDEPENDENT_ACTIVATION;
        let ownerIndex = 0;

        for (const tile of affectedTiles) {
            if (tile.isOwner()) {
                ownerIndex++;
                points += SCORE.OWNER_REMOVED_STEP * ownerIndex;
            } else if (!tile.isIndependent()) {
                points += SCORE.MEDIA_FREED;
            }
        }

        this.ownersRemoved += ownerIndex;

        const series = this.isSeriesActive() ? SCORE.SERIES_MULTIPLIER : 1;
        this.lastIndependentMove = this.moveCount;

        return this.add(points * series * this.pluralism);
    }

    add(points) {
        const rounded = Math.round(points);
        this.total += rounded;

        return rounded;
    }

    isStraightLine(group) {
        return group.every(cell => cell.x === group[0].x) ||
            group.every(cell => cell.y === group[0].y);
    }

    // À appeler en fin de partie
    saveBest() {
        this.isNewBest = this.total > this.best;

        if (!this.isNewBest) return;

        this.best = this.total;

        try {
            localStorage.setItem(BEST_SCORE_KEY, String(this.best));
        } catch {
            // Stockage indisponible (navigation privée...) : on garde le record en mémoire
        }
    }

    loadBest() {
        try {
            return Number(localStorage.getItem(BEST_SCORE_KEY)) || 0;
        } catch {
            return 0;
        }
    }
}
