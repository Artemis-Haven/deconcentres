export const MEDIA_CATALOG = {
    red: {
        owner: "Vincent Bolloré",
        items: [
            { name: "Canal+", img: "canalplus.png", logo: { style: "plain", wide: true} },
            { name: "CNews", img: "cnews.png", logo: { style: "plain", wide: true} },
            { name: "Europe 1", img: "europe1.png", logo: { style: "plain", wide: true} },
            { name: "Capital", img: "capital.png", logo: { style: "plain", wide: true} },
            { name: "Voici", img: "voici.png", logo: { style: "white", wide: true} },
            { name: "Journal du dimanche", img: "jdd.png", logo: { style: "white", showName: true} },
            { name: "CStar", img: "cstar.svg", logo: { style: "plain", wide: true} },
            { name: "Europe 2", img: "europe2.png", logo: { style: "plain", size: 100} },
            { name: "RFM", img: "rfm.svg", logo: { style: "plain"} },
            { name: "Femme Actuelle", img: "femmeactuelle.png", logo: { style: "plain"} },
            { name: "GEO", img: "geo.svg", logo: { style: "plain"} },
            { name: "Télé-Loisirs", img: "teleloisirs.png", logo: { style: "white", size: 100} },
            { name: "Ça m'intéresse", img: "caminteresse.png", logo: { style: "plain"} },
            { name: "Télé Z", img: "telez.png", logo: { style: "plain"} },
            { name: "Ici Paris", img: "iciparis.jpg", logo: { style: "plain"} },
            { name: "France Dimanche", img: "francedimanche.jpg", logo: { style: "plain", wide: true} }
        ]
    },

    blue: {
        owner: "Rodolphe Saadé",
        items: [
            { name: "RMC", img: "rmc.png", logo: { style: "plain", wide: true} },
            { name: "BFM TV", img: "bfmtv.png", logo: { style: "plain", wide: true} },
            { name: "La Provence", img: "laprovence.png", logo: { style: "white", showName: true} },
            { name: "Brut", img: "brut.png", logo: { style: "plain", wide: true} },
            { name: "La Tribune", img: "latribune.jpg", logo: { style: "plain", wide: true} },
            { name: "Corse-Matin", img: "corsematin.svg", logo: { style: "plain", size: 100} }
        ]
    },

    purple: {
        owner: "Bernard Arnault",
        items: [
            { name: "Le Parisien", img: "leparisien.png", logo: { style: "plain", wide: true} },
            { name: "Les Echos", img: "lesechos.png", logo: { style: "plain", wide: true} },
            { name: "Sciences et Avenir", img: "scienceavenir.jpg", logo: { style: "plain", wide: true} },
            { name: "Paris Match", img: "parismatch.png", logo: { style: "plain", wide: true} },
            { name: "Aujourd'hui en France", img: "aujourdhui.png", logo: { style: "plain", wide: true} },
            { name: "Radio Classique", img: "radioclassique.svg", logo: { style: "white"} },
            { name: "Challenges", img: "challenges.png", logo: { style: "plain", wide: true} },
            { name: "L'Opinion", img: "lopinion.svg", logo: { style: "plate", wide: true} },
            { name: "L'Agefi", img: "lagefi.png", logo: { style: "plate", wide: true} },
            { name: "Investir", img: "investir.jpg", logo: { style: "plain", wide: true} }
        ]
    },

    yellow: {
        owner: "Martin Bouygues",
        items: [
            { name: "TF1", img: "tf1.png", logo: { style: "plain", wide: true} },
            { name: "LCI", img: "lci.png", logo: { style: "plain", wide: true} },
            { name: "TMC", img: "tmc.png", logo: { style: "plain", wide: true} },
            { name: "TFX", img: "tfx.png", logo: { style: "plain", wide: true} },
            { name: "TV Breizh", img: "tvbreizh.svg", logo: { style: "plain", wide: true} },
            { name: "Ushuaïa TV", img: "ushuaiatv.svg", logo: { style: "plate", wide: true} },
            { name: "Histoire TV", img: "histoiretv.svg", logo: { style: "plain", wide: true} }
        ]
    },

    green: {
        owner: null,
        items: [
            // Croisement des sources
            { name: "Fakir", img: "fakir.jpg", effect: "cross", logo: {style: "plain", wide: true} },
            { name: "Arrêt sur Image", img: "asi.svg", effect: "cross", logo: { style: "plain", wide: true, size: 100 } },
            { name: "Contexte", img: "contexte.png", effect: "cross", logo: { style: "plain", wide: true } },
            { name: "Vert", img: "vert.png", effect: "cross", logo: {style: "plain", wide: true} },
            { name: "Bon Pote", img: "bonpote.png", effect: "cross", logo: {style: "plain", size: 80, showName: true} },
            { name: "Socialter", img: "socialter.png", effect: "cross", logo: {style: "white", wide: true, size: 130} },
            { name: "Alternatives économiques", shortName: 'Alternatives\n économiques', img: "alternativeseconomiques.svg", effect: "cross", logo: { style: "plain", wide: true, showName: true } },

            // Enquête
            { name: "Blast", img: "blast.svg", effect: "square", logo: {style: "plain", wide: true, size: 110} },
            { name: "Basta", img: "basta.svg", effect: "square", logo: { style: "plate", wide: true } },
            { name: "Disclose", img: "disclose.png", effect: "square", logo: { style: "plain", wide: true, size: 120, showName: true } },
            { name: "Off Investigation", shortName: "Off\nInvestigation", img: "offinvestigation.png", effect: "square", logo: { style: "plain", wide: true, showName: true} },
            { name: "Les Jours", img: "lesjours.png", effect: "square", logo: { style: "white" } },
            { name: "StreetPress", img: "streetpress.png", effect: "square", logo: { style: "plain", size: 90 } },
            { name: "L'Informé", img: "linforme.png", effect: "square", logo: { style: "plain", wide: true } },
            { name: "Reporterre", img: "reporterre.png", effect: "square", logo: { style: "plain", showName: true } },
            { name: "Le Bondy Blog", shortName: "Le Bondy\nBlog", img: "bondyblog.png", effect: "square", logo: { style: "plain", showName: true } },
            { name: "La Revue dessinée", shortName: "La Revue\ndessinée", img: "revuedessinee.svg", effect: "square", logo: { style: "plain", showName: true } },

            // Démantèlement
            { name: "Mediapart", img: "mediapart.svg", effect: "dismantle", logo: { style: "plain", wide: true, size: 115 } },
            { name: "L'Humanité", img: "humanite.svg", effect: "dismantle", logo: { style: "plain", wide: true, size: 120 } },
            { name: "Le Canard enchaîné", img: "canardenchaine.svg", effect: "dismantle", logo: { style: "plain", wide: true } },
            { name: "Politis", img: "politis.png", effect: "dismantle", logo: { style: "white", wide: true } },
            { name: "Regards", img: "regards.png", effect: "dismantle", logo: { style: "plain", showName: true } },
            { name: "Le Média", img: "lemedia.svg", effect: "dismantle", logo: { style: "plain", wide: true, showName: true } },
            { name: "La Déferlante", img: "ladeferlante.png", effect: "dismantle", logo: { style: "plain", wide: true, size: 120 } },
            { name: "Frustration Magazine", shortName: "Frustration\nMagazine", img: "frustration.jpg", effect: "dismantle", logo: { style: "plain", showName: true} },
            { name: "Au Poste", img: "auposte.png", effect: "dismantle", logo: { style: "plain", wide: true, showName: true } },
            { name: "Charlie Hebdo", img: "charliehebdo.png", effect: "dismantle", logo: { style: "plain", size: 100 } }
        ]
    }
};