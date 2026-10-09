export const MEDIA_CATALOG = {
    red: {
        owner: "Vincent Bolloré",
        group: "Groupe Bolloré",
        presentation: "Industriel breton, il a bâti en quelques années un empire qui couvre la télévision, la radio, la presse, l'édition, la publicité et jusqu'aux boutiques de gare. Plusieurs de ses rachats se sont accompagnés de départs massifs de journalistes, comme à iTélé (devenue CNews), à Europe 1 ou au JDD.",
        empire: [
            { category: "Télévision", media: "Canal+, CNews, CStar" },
            { category: "Radio", media: "Europe 1, Europe 2, RFM" },
            { category: "Presse", media: "Le JDD, JDNews" },
            { category: "Magazines", media: "Prisma Media, premier éditeur de magazines en France : Voici, Capital, Femme Actuelle, GEO, Télé-Loisirs, Ça m'intéresse, Télé Z, Ici Paris, France Dimanche…" },
            { category: "Édition", media: "Hachette Livre, l'un des cinq premiers éditeurs mondiaux : Grasset, Fayard, Stock, Calmann-Lévy, JC Lattès, Larousse, Hatier, Dunod, Armand Colin, Le Livre de Poche…" },
            { category: "Édition jeunesse", media: "Hachette Jeunesse, l'un des premiers éditeurs jeunesse en France" },
            { category: "Cinéma", media: "StudioCanal" },
            { category: "Publicité", media: "Havas, première agence de publicité française" },
            { category: "Points de vente", media: "Relay (environ 300 boutiques dans plus de 270 gares en France) et Lagardère Travel Retail (près de 5 000 points de vente dans les gares et aéroports de 51 pays)" }
        ],
        items: [
            { name: "Canal+", img: "canalplus.png", logo: { style: "plain", wide: true} },
            { name: "CNews", img: "cnews.webp", logo: { style: "plain", wide: true} },
            { name: "Europe 1", img: "europe1.png", logo: { style: "plain", wide: true} },
            { name: "Capital", img: "capital.png", logo: { style: "plain", wide: true} },
            { name: "Voici", img: "voici.png", logo: { style: "white", wide: true} },
            { name: "Journal du dimanche", img: "jdd.png", logo: { style: "white", showName: true} },
            { name: "CStar", img: "cstar.svg", logo: { style: "plain", wide: true} },
            { name: "Europe 2", img: "europe2.webp", logo: { style: "plain", size: 100} },
            { name: "RFM", img: "rfm.svg", logo: { style: "plain"} },
            { name: "Femme Actuelle", img: "femmeactuelle.png", logo: { style: "plain"} },
            { name: "GEO", img: "geo.svg", logo: { style: "plain"} },
            { name: "Télé-Loisirs", img: "teleloisirs.webp", logo: { style: "white", size: 100} },
            { name: "Ça m'intéresse", img: "caminteresse.webp", logo: { style: "plain"} },
            { name: "Télé Z", img: "telez.png", logo: { style: "plain"} },
            { name: "Ici Paris", img: "iciparis.webp", logo: { style: "plain"} },
            { name: "France Dimanche", img: "francedimanche.jpg", logo: { style: "plain", wide: true} }
        ]
    },

    blue: {
        owner: "Rodolphe Saadé",
        group: "CMA CGM",
        presentation: "Armateur à la tête de CMA CGM, troisième transporteur maritime au monde. Depuis 2022, il a racheté coup sur coup de nombreux médias, de la presse régionale jusqu'à BFM TV et RMC.",
        empire: [
            { category: "Télévision", media: "BFM TV, BFM Business, les chaînes locales BFM, RMC Story, RMC Découverte" },
            { category: "Radio", media: "RMC" },
            { category: "Presse", media: "La Tribune, La Tribune Dimanche, La Provence, Corse-Matin, Air & Cosmos" },
            { category: "Numérique", media: "Brut" },
            { category: "Participation", media: "environ 11 % du groupe M6 (dont W9, 6ter, RTL, RTL2, Gulli et Fun Radio)" }
        ],
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
        group: "LVMH",
        presentation: "PDG de LVMH, numéro un mondial du luxe, et l'une des premières fortunes du monde. Il possède la plupart des grands titres de la presse économique française.",
        empire: [
            { category: "Presse économique", media: "Les Echos, Investir, L'Agefi, Challenges" },
            { category: "Presse quotidienne", media: "Le Parisien, Aujourd'hui en France, L'Opinion" },
            { category: "Magazines", media: "Paris Match, Sciences et Avenir, Historia" },
            { category: "Radio", media: "Radio Classique" }
        ],
        items: [
            { name: "Le Parisien", img: "leparisien.png", logo: { style: "plain", wide: true} },
            { name: "Les Echos", img: "lesechos.png", logo: { style: "plain", wide: true} },
            { name: "Sciences et Avenir", img: "scienceavenir.jpg", logo: { style: "plain", wide: true} },
            { name: "Paris Match", img: "parismatch.png", logo: { style: "plain", wide: true} },
            { name: "Aujourd'hui en France", img: "aujourdhui.webp", logo: { style: "plain", wide: true} },
            { name: "Radio Classique", img: "radioclassique.svg", logo: { style: "white"} },
            { name: "Challenges", img: "challenges.webp", logo: { style: "plain", wide: true} },
            { name: "L'Opinion", img: "lopinion.svg", logo: { style: "plate", wide: true} },
            { name: "L'Agefi", img: "lagefi.webp", logo: { style: "plate", wide: true} },
            { name: "Investir", img: "investir.jpg", logo: { style: "plain", wide: true} }
        ]
    },

    yellow: {
        owner: "Martin Bouygues",
        group: "Groupe Bouygues",
        presentation: "À la tête du groupe Bouygues, présent dans le BTP et les télécoms. Son groupe possède TF1, la chaîne la plus regardée de France, et tout un bouquet de chaînes.",
        empire: [
            { category: "Télévision", media: "TF1, LCI, TMC, TFX, TF1 Séries Films" },
            { category: "Chaînes thématiques", media: "TV Breizh, Ushuaïa TV, Histoire TV" },
            { category: "Autres activités du groupe", media: "Bouygues Telecom, Bouygues Construction" }
        ],
        items: [
            { name: "TF1", img: "tf1.png", logo: { style: "plain", wide: true} },
            { name: "LCI", img: "lci.webp", logo: { style: "plain", wide: true} },
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
            { name: "Fakir", img: "fakir.jpg", effect: "cross", url: "https://fakirpresse.info", description: "Journal d'enquête sociale et satirique né à Amiens en 1999, financé par ses lecteurs, sans publicité.", highlight: "Connu pour le film « Merci patron ! » (César du meilleur documentaire 2017), qui met en scène Bernard Arnault et LVMH.", logo: {style: "plain", wide: true} },
            { name: "Arrêt sur Image", img: "asi.svg", effect: "cross", url: "https://www.arretsurimages.net", description: "Site d'analyse critique des médias fondé par Daniel Schneidermann, financé par ses abonnés.", highlight: "Né d'une émission de critique des médias sur France 5, arrêtée par la chaîne en 2007.", logo: { style: "plain", wide: true, size: 100 } },
            { name: "Contexte", img: "contexte.png", effect: "cross", url: "https://www.contexte.com", description: "Média spécialisé dans le suivi des politiques publiques, en France et en Europe.", logo: { style: "plain", wide: true } },
            { name: "Vert", img: "vert.webp", effect: "cross", url: "https://vert.eco", description: "Média en ligne consacré à l'écologie et au climat, lancé en 2020, gratuit et financé par ses lecteurs.", logo: {style: "plain", wide: true} },
            { name: "Bon Pote", img: "bonpote.webp", effect: "cross", url: "https://bonpote.com", description: "Média de vulgarisation sur le changement climatique, qui décrypte les études scientifiques et les fausses solutions.", logo: {style: "plain", size: 80, showName: true} },
            { name: "Socialter", img: "socialter.png", effect: "cross", url: "https://www.socialter.fr", description: "Magazine qui explore les alternatives écologiques et sociales, entre enquêtes et réflexions.", logo: {style: "white", wide: true, size: 130} },
            { name: "Alternatives économiques", shortName: 'Alternatives\n économiques', img: "alternativeseconomiques.svg", effect: "cross", url: "https://www.alternatives-economiques.fr", description: "Mensuel d'information économique et sociale fondé en 1980, édité par une coopérative.", logo: { style: "plain", wide: true, showName: true } },

            // Enquête
            { name: "Blast", img: "blast.svg", effect: "square", url: "https://www.blast-info.fr", description: "Média vidéo et site d'information lancé en 2021 par Denis Robert, financé par les dons de son public.", highlight: "Fondé par Denis Robert, connu pour avoir révélé l'affaire Clearstream.", logo: {style: "plain", wide: true, size: 110} },
            { name: "Basta", img: "basta.svg", effect: "square", url: "https://basta.media", description: "Média en ligne sur les questions sociales, écologiques et les alternatives, porté par une association.", highlight: "Tient depuis 2018 une base de données de référence des personnes tuées lors d'interventions policières.", logo: { style: "plate", wide: true } },
            { name: "Disclose", img: "disclose.png", effect: "square", url: "https://disclose.ngo", description: "Média d'investigation à but non lucratif fondé en 2018, qui publie ses enquêtes en partenariat avec d'autres rédactions.", highlight: "A révélé l'utilisation d'armes françaises dans la guerre au Yémen et l'opération Sirli, où des renseignements français ont servi à des frappes meurtrières en Égypte.", logo: { style: "plain", wide: true, size: 120, showName: true } },
            { name: "Off Investigation", shortName: "Off\nInvestigation", img: "offinvestigation.png", effect: "square", url: "https://www.off-investigation.fr", description: "Média de documentaires d'investigation, financé par son public.", logo: { style: "plain", wide: true, showName: true} },
            { name: "Les Jours", img: "lesjours.png", effect: "square", url: "https://lesjours.fr", description: "Site d'information qui raconte l'actualité en séries, fondé en 2016 par d'anciens journalistes de Libération.", logo: { style: "white" } },
            { name: "StreetPress", img: "streetpress.png", effect: "square", url: "https://www.streetpress.com", description: "Média en ligne de reportages et d'enquêtes sur la société, les quartiers populaires et l'extrême droite.", highlight: "A cartographié plus de 300 groupes d'extrême droite en France et révélé en 2020 un groupe Facebook de policiers aux messages racistes.", logo: { style: "plain", size: 90 } },
            { name: "L'Informé", img: "linforme.png", effect: "square", url: "https://www.linforme.com", description: "Média d'investigation économique lancé en 2024, financé par Xavier Niel avec des garanties d'indépendance pour sa rédaction.", logo: { style: "plain", wide: true } },
            { name: "Reporterre", img: "reporterre.png", effect: "square", url: "https://reporterre.net", description: "Quotidien de l'écologie en ligne, gratuit et sans publicité, édité par une association à but non lucratif.", highlight: "A révélé ce qui s'est réellement passé la nuit de la mort de Rémi Fraisse, tué par une grenade de gendarme à Sivens en 2014.", logo: { style: "plain", showName: true } },
            { name: "Le Bondy Blog", shortName: "Le Bondy\nBlog", img: "bondyblog.png", effect: "square", url: "https://www.bondyblog.fr", description: "Média né en 2005 pendant les révoltes des banlieues, qui donne la parole aux quartiers populaires.", logo: { style: "plain", showName: true } },
            { name: "La Revue dessinée", shortName: "La Revue\ndessinée", img: "revuedessinee.svg", effect: "square", url: "https://www.larevuedessinee.fr", description: "Revue de reportages et d'enquêtes en bande dessinée.", logo: { style: "plain", showName: true } },

            // Démantèlement
            { name: "Mediapart", img: "mediapart.svg", effect: "dismantle", url: "https://www.mediapart.fr", description: "Journal d'investigation en ligne fondé en 2008, financé uniquement par ses abonnés, sans publicité.", highlight: "A révélé les affaires Bettencourt et Cahuzac et le financement libyen de la campagne de Nicolas Sarkozy, et publié des révélations majeures dans l'affaire Benalla.", logo: { style: "plain", wide: true, size: 115 } },
            { name: "L'Humanité", img: "humanite.svg", effect: "dismantle", url: "https://www.humanite.fr", description: "Quotidien fondé par Jean Jaurès en 1904, soutenu par ses lecteurs.", logo: { style: "plain", wide: true, size: 120 } },
            { name: "Le Canard enchaîné", img: "canardenchaine.svg", effect: "dismantle", url: "https://www.lecanardenchaine.fr", description: "Hebdomadaire satirique et d'investigation fondé en 1915, sans publicité et détenu par ses journalistes.", highlight: "A révélé l'affaire des diamants de Bokassa, le passé vichyste de Maurice Papon et l'affaire des emplois de Penelope Fillon.", logo: { style: "plain", wide: true } },
            { name: "Politis", img: "politis.webp", effect: "dismantle", url: "https://www.politis.fr", description: "Hebdomadaire d'information et de débat d'idées, fondé en 1988.", logo: { style: "white", wide: true } },
            { name: "Regards", img: "regards.webp", effect: "dismantle", url: "https://regards.fr", description: "Revue et site de critique sociale et de débats d'idées à gauche.", logo: { style: "plain", showName: true } },
            { name: "Le Média", img: "lemedia.svg", effect: "dismantle", url: "https://www.lemediatv.fr", description: "Média en ligne (site et chaîne vidéo) lancé en 2018, financé par ses soutiens, les « socios ».", logo: { style: "plain", wide: true, showName: true } },
            { name: "La Déferlante", img: "ladeferlante.png", effect: "dismantle", url: "https://revueladeferlante.fr", description: "Revue féministe lancée en 2021, consacrée aux luttes féministes et aux questions de genre.", logo: { style: "plain", wide: true, size: 120 } },
            { name: "Frustration Magazine", shortName: "Frustration\nMagazine", img: "frustration.jpg", effect: "dismantle", url: "https://frustrationmagazine.fr", description: "Magazine de critique sociale qui analyse les rapports de classe et la domination des plus riches.", logo: { style: "plain", showName: true} },
            { name: "Au Poste", img: "auposte.webp", effect: "dismantle", url: "https://auposte.media", description: "Chaîne vidéo animée par le journaliste David Dufresne, consacrée aux libertés publiques.", highlight: "David Dufresne s'est fait connaître avec « Allô Place Beauvau », son recensement des violences policières pendant le mouvement des gilets jaunes.", logo: { style: "plain", wide: true, showName: true } },
            { name: "Charlie Hebdo", img: "charliehebdo.png", effect: "dismantle", url: "https://charliehebdo.fr", description: "Hebdomadaire satirique fondé en 1970, sans publicité.", highlight: "Visé par l'attentat du 7 janvier 2015, qui a tué une grande partie de sa rédaction, il est devenu un symbole de la liberté d'expression.", logo: { style: "plain", size: 100 } }
        ]
    }
};

// Autres propriétaires (guide uniquement)
export const OTHER_OWNERS = [
    { owner: "Famille Dassault", group: "Groupe Figaro", media: "Le Figaro, Gala, TV Magazine, Le Particulier, Le Journal des Femmes, Journal du Net, L'Internaute, La Chaîne Météo" },
    { owner: "François Pinault", group: "Artémis", media: "Le Point, Point de Vue, 40 % du 1 hebdo, les éditions Tallandier" },
    { owner: "Daniel Kretinsky", group: "CMI France", media: "Elle, Marianne, Franc-Tireur, et le groupe d'édition Editis" },
    { owner: "Xavier Niel", group: "NJJ", media: "Nice-Matin, financeur de L'Informé, rachat de 60 Millions de consommateurs en cours. Il a transféré en 2024 ses parts du groupe Le Monde à un fonds pour l'indépendance de la presse." }
];
