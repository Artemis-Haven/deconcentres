export const BOARD_SIZE = 8;

export const COLORS = [
    "red",
    "blue",
    "yellow",
    "purple",
    "green"
];

export const INDEPENDENT_MEDIA_SPAWN_RATE = 0.1;

// Date de vérification des infos (affichée via data-info-updated, cf. site.js)
export const INFO_UPDATED = "octobre 2026";

// Bloc élections (temporaire)
export const ELECTIONS_BLOCK_ENABLED = true;

// Délai avant affichage d'un indice
export const HINT_DELAY_MS = 15000;

// Bonus de proba si l'effet est déjà présent dans les colonnes voisines
export const INDEPENDENT_NEARBY_BOOST = 3;

// Effets des indépendants (ordre d'affichage), équiprobables
export const INDEPENDENT_EFFECTS = ["cross", "square", "dismantle"];

export const TILE_TYPE = {
    MEDIA: "media",
    OWNER: "owner"
};

export const GAME_STATE = {
    READY: "ready",
    PLAYING: "playing",
    GAME_OVER: "game_over"
};


export const SCORE = {
    // Points de base par taille d'alignement
    MATCH_POINTS: { 3: 30, 4: 60, 5: 100 },
    SHAPE_BONUS: 50, // forme en L ou en T

    INDEPENDENT_ACTIVATION: 100,
    OWNER_REMOVED_STEP: 50, // 50, puis 100, 150... par propriétaire retiré
    MEDIA_FREED: 10, // par média libéré par une enquête

    // Série indépendante : deux activations rapprochées
    SERIES_WINDOW: 5, // en nombre de coups
    SERIES_MULTIPLIER: 1.5,

    // Indice de pluralisme, selon le nombre de propriétaires en début de coup
    PLURALISM: [
        { maxOwners: 3, multiplier: 2 },
        { maxOwners: 6, multiplier: 1.5 },
        { maxOwners: 10, multiplier: 1 },
        { maxOwners: Infinity, multiplier: 0.5 }
    ]
};

export const EFFECT_NAMES = {
    cross: "Croisement des sources",
    square: "Enquête",
    dismantle: "Démantèlement"
};

export const EFFECT_DESCRIPTIONS = {
    cross: "Retire les propriétaires de la ligne et de la colonne",
    square: "Libère une zone de 3×3 : retire les propriétaires et leurs médias",
    dismantle: "Démantèle le groupe le plus présent : retire tous ses propriétaires"
};
