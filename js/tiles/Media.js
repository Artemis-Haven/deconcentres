import { Tile } from "./Tile.js";
import { TILE_TYPE } from "../constants.js";

export class Media extends Tile {

    constructor(color, data) {

        super(TILE_TYPE.MEDIA, data.name, color);

        this.img = data.img;

        // Nom affiché sur la tuile, plus court que le nom complet ;
        // « \n » force un retour à la ligne (ex. "Bondy\nBlog")
        this.shortName = data.shortName || null;

        this.effect = data.effect || null;

        // Affichage d'un vrai logo, absent pour les images provisoires :
        // - style : "plain" (tel quel), "plate" (sur étiquette blanche) ou "white" (passé en blanc)
        // - wide : logo allongé, sur toute la largeur
        // - size : taille en % de la case (largeur pour un logo allongé)
        // - showName : affiche quand même le nom sous le logo
        this.logo = data.logo || null;
    }

    isIndependent() {
        return this.color === "green";
    }
}