// Propositions des partis en lien avec la concentration des médias,
// l'indépendance des rédactions et l'audiovisuel public.
// Relevé d'octobre 2026, à mettre à jour au fil de la campagne.
// fightsConcentration : proposition explicitement en faveur de la lutte contre
// la concentration des médias ou de l'indépendance des rédactions,
// affichée en vert (les autres en blanc).
// proposals vide : « Aucune proposition identifiée » s'affiche en gris.

export const ELECTIONS_UPDATED = "octobre 2026";

// Orientation politique : puce de couleur devant le nom du parti, et légende
export const ORIENTATIONS = {
    "gauche-radicale": { label: "Gauche radicale", color: "#d23a32" },
    "ecologie": { label: "Écologie", color: "#3fae5a" },
    "gauche": { label: "Gauche", color: "#e4689f" },
    "centre": { label: "Centre", color: "#f0942b" },
    "centre-droit": { label: "Centre droit", color: "#5aa9e6" },
    "droite": { label: "Droite", color: "#2f5fb3" },
    "extreme-droite": { label: "Extrême droite", color: "#8a5a3c" }
};

export const PARTIES = [
    {
        name: "PCF",
        orientation: "gauche-radicale",
        proposals: [
            { text: "Loi contre les concentrations dans la presse, les médias et l'audiovisuel", fightsConcentration: true }
        ],
        sources: [
            { label: "Programme de Fabien Roussel (votons-2027.fr)", url: "https://votons-2027.fr/candidats/roussel/programme/institutions" }
        ]
    },
    {
        name: "La France insoumise",
        orientation: "gauche-radicale",
        proposals: [
            { text: "Loi anti-concentration des médias", fightsConcentration: true },
            { text: "Plafond de 20 % du capital dans plusieurs médias", fightsConcentration: true },
            { text: "Séparation des infrastructures et de la production de contenus", fightsConcentration: true },
            { text: "Statut juridique pour les rédactions", fightsConcentration: true }
        ],
        sources: [
            { label: "Programme 2027 (melenchon2027.fr)", url: "https://melenchon2027.fr/programme2025/livre/chapitre1/s6/" },
            { label: "Proposition de loi n° 327 (2022)", url: "https://www.assemblee-nationale.fr/dyn/16/textes/l16b0327_proposition-loi.pdf" }
        ]
    },
    {
        name: "Les Écologistes",
        orientation: "ecologie",
        proposals: [
            { text: "Seuil anti-concentration unique, mesuré sur l'influence sur l'opinion publique", fightsConcentration: true },
            { text: "Fin des monopoles économiques dans les médias", fightsConcentration: true }
        ],
        sources: [
            { label: "Proposition de loi n° 2429, groupe Écologiste et social (2026)", url: "https://www.assemblee-nationale.fr/dyn/17/dossiers/monopoles_economiques_medias_17e" }
        ]
    },
    {
        name: "Parti socialiste",
        orientation: "gauche",
        proposals: [
            { text: "Droit d'agrément des rédactions sur la nomination de leur directeur", fightsConcentration: true },
            { text: "Renforcement de l'indépendance des médias", fightsConcentration: true }
        ],
        sources: [
            { label: "Public Sénat : proposition de loi socialiste", url: "https://www.publicsenat.fr/actualites/parlementaire/sattaquer-aux-racines-de-la-crise-democratique-au-senat-une-proposition-de-loi-pour-renforcer-lindependance-des-medias" }
        ]
    },
    {
        name: "Place publique",
        orientation: "gauche",
        proposals: [
            { text: "Réforme de la loi de 1986 contre la concentration des médias", fightsConcentration: true },
            { text: "Financement stable de la presse par une taxe sur les géants du numérique" },
            { text: "Renforcement de l'audiovisuel public" },
            { text: "Délit de désinformation organisée" }
        ],
        sources: [
            { label: "Place publique : contre la mainmise de Vincent Bolloré (2026)", url: "https://place-publique.eu/posts/5q3JVyVsJCUxrE5P3ESBJV/menons-le-combat-contre-la-mainmise-de-vincent-bollore-sur-le-monde-des-idees-et-de-la-creation" }
        ]
    },
    {
        name: "MoDem",
        orientation: "centre",
        proposals: [],
        sources: []
    },
    {
        name: "Renaissance",
        orientation: "centre",
        proposals: [
            { text: "Regroupement de l'audiovisuel public dans une holding « France Médias »" }
        ],
        sources: [
            { label: "LCP : la réforme de l'audiovisuel public", url: "https://lcp.fr/actualites/audiovisuel-public-la-reforme-defendue-par-rachida-dati-fait-son-retour-a-l-assemblee" }
        ]
    },
    {
        name: "Horizons",
        orientation: "centre-droit",
        proposals: [
            { text: "Fusion des sociétés de l'audiovisuel public" },
            { text: "Transparence et respect du pluralisme dans l'audiovisuel public" }
        ],
        sources: [
            { label: "Rapport de la commission d'enquête sur l'audiovisuel public (2026)", url: "https://lcp.fr/actualites/hypermediatisation-tribunal-politique-le-president-de-la-commission-d-enquete-sur-l" }
        ]
    },
    {
        name: "Les Républicains",
        orientation: "droite",
        proposals: [
            { text: "Holding « France Médias » pour l'audiovisuel public" },
            { text: "Maintien de l'audiovisuel public, sans privatisation" },
            { text: "Financement stable de l'audiovisuel public" }
        ],
        sources: [
            { label: "LCP : création d'une holding pour l'audiovisuel public", url: "https://lcp.fr/actualites/reforme-de-l-audiovisuel-public-la-creation-d-une-holding-sans-france-medias-monde-actee" }
        ]
    },
    {
        name: "UDR",
        orientation: "extreme-droite",
        proposals: [
            { text: "Fusion de France 2 et France 5, de franceinfo et France 24" },
            { text: "Suppression de France 4 et de Mouv'" },
            { text: "Devoir de neutralité des personnalités de l'audiovisuel public" },
            { text: "Nomination des patrons de France Télévisions et Radio France par le président de la République" }
        ],
        sources: [
            { label: "Franceinfo : le rapport de Charles Alloncle (2026)", url: "https://www.franceinfo.fr/politique/commission-d-enquete-sur-l-audiovisuel-public-quelles-suites-apres-l-adoption-du-rapport-de-charles-alloncle_7967396.html" }
        ]
    },
    {
        name: "Rassemblement national",
        orientation: "extreme-droite",
        proposals: [
            { text: "Privatisation de France Télévisions et Radio France" },
            { text: "Maintien dans le public d'Arte, TV5 Monde, France Médias Monde et de l'INA" }
        ],
        sources: [
            { label: "Jordan Bardella sur la privatisation de l'audiovisuel public (2026)", url: "https://actu.orange.fr/videos/france/a-la-tete-du-pays-nous-engagerons-la-privatisation-de-l-audiovisuel-public-declare-jordan-bardella-CNT000002oWZ8y.html" },
            { label: "Le Devoir : le RN et l'audiovisuel public", url: "https://www.ledevoir.com/monde/europe/815638/france-audiovisuel-public-craint-etre-privatise-ou-soumis-propagande" }
        ]
    },
    {
        name: "Reconquête",
        orientation: "extreme-droite",
        proposals: [
            { text: "Privatisation de France Inter et France Télévisions (programme 2022)" },
            { text: "Service public resserré : France 5, France Culture, France 24, RFI, TV5 Monde (programme 2022)" }
        ],
        sources: [
            { label: "Institut Montaigne : programme d'Éric Zemmour (2022)", url: "https://www.institutmontaigne.org/presidentielle-2022/eric-zemmour/supprimer-la-redevance-audiovisuelle-et-privatiser-laudiovisuel-public-en-particulier-france-inter-et-france-tv/" }
        ]
    }
];
