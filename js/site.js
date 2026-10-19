import { INFO_UPDATED } from "./constants.js";
import { sendToStats } from "./analytics.js";
import { initShareButtons } from "./ui/Share.js";

// Date de vérification dans les pages
for (const element of document.querySelectorAll("[data-info-updated]")) {
    element.textContent = INFO_UPDATED;
}

initShareButtons();

if (document.querySelector("#board")) sendToStats("v.html");
