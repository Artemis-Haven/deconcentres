import { INFO_UPDATED } from "./constants.js";

// Date de vérification dans les pages
for (const element of document.querySelectorAll("[data-info-updated]")) {
    element.textContent = INFO_UPDATED;
}
