// Propositions des partis sur les médias (à mettre à jour pendant la campagne)
// fightsConcentration: true => en vert
// proposals vide => "Aucune proposition identifiée"


// Couleur de la puce par orientation
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
            { label: "Programme L'Avenir en commun (avenir-en-commun.net)", url: "https://avenir-en-commun.net/revolution-citoyenne" },
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
            { label: "Proposition de loi n° 741 au Sénat (2024)", url: "https://www.senat.fr/leg/ppl23-741.html" }
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
            { text: "Fusion de France Télévisions et Radio France" },
            { text: "Financement stable de l'audiovisuel public" },
            { text: "Encadrement des engagements politiques des personnels et des passerelles avec le privé" },
            { text: "Allègement des règles fiscales et réglementaires de l'audiovisuel" }
        ],
        sources: [
            { label: "Contribution du groupe Droite républicaine au rapport de la commission d'enquête sur l'audiovisuel public (2026, p. 518)", url: "https://www.assemblee-nationale.fr/dyn/17/rapports/ceaudio/l17b2698-t1_rapport-enquete.pdf#page=516" }
        ]
    },
    {
        name: "UDR",
        orientation: "extreme-droite",
        proposals: [
            { text: "Fusion et suppression de chaines publiques" },
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
            { text: "Privatisation partielle de France Télévisions et Radio France" },
            { text: "Suppression de France 4" },
            { text: "Encadrement des animateurs-producteurs" },
            { text: "Encadrement de l'expression des journalistes du public sur les réseaux sociaux" }
        ],
        sources: [
            { label: "Contribution du groupe RN au rapport de la commission d'enquête sur l'audiovisuel public (2026, p. 495)", url: "https://www.assemblee-nationale.fr/dyn/17/rapports/ceaudio/l17b2698-t1_rapport-enquete.pdf#page=493" }
        ]
    },
    {
        name: "Reconquête",
        orientation: "extreme-droite",
        proposals: [
            { text: "Privatisation partielle de France Télévisions et Radio France (programme 2022)" },
            { text: "France 3 et France Bleu confiés aux collectivités locales (programme 2022)" }
        ],
        sources: [
            { label: "Institut Montaigne : programme d'Éric Zemmour (2022)", url: "https://www.institutmontaigne.org/presidentielle-2022/eric-zemmour/supprimer-la-redevance-audiovisuelle-et-privatiser-laudiovisuel-public-en-particulier-france-inter-et-france-tv/" }
        ]
    }
];
