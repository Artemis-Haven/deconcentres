import { INFO_UPDATED } from "./constants.js";

// Commun à toutes les pages : insère la date de vérification des informations
for (const element of document.querySelectorAll("[data-info-updated]")) {
    element.textContent = INFO_UPDATED;
}
