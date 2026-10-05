export const BOARD_SIZE = 8;

export const COLORS = [
    "red",
    "blue",
    "yellow",
    "purple",
    "green"
];

export const INDEPENDENT_MEDIA_SPAWN_RATE = 0.1;

// Délai d'inactivité avant de montrer un coup jouable au joueur
export const HINT_DELAY_MS = 15000;

// Bonus de probabilité d'un effet par média indépendant de même effet
// déjà présent dans les colonnes voisines (facilite la formation de paires)
export const INDEPENDENT_NEARBY_BOOST = 3;

// Effets des médias indépendants, dans leur ordre d'affichage.
// Chaque effet a la même chance d'apparaître, quel que soit son nombre de médias
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
    // Points de base selon la taille de l'alignement (5 et plus : 100)
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
