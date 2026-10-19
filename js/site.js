import { INFO_UPDATED, SITE_URL, VISITS_URL } from "./constants.js";
import { initShareButtons } from "./ui/Share.js";

// Date de vérification dans les pages
for (const element of document.querySelectorAll("[data-info-updated]")) {
    element.textContent = INFO_UPDATED;
}

initShareButtons();

function countVisit() {
    if (location.origin !== new URL(SITE_URL).origin || !document.querySelector("#board")) return;

    fetch(`${VISITS_URL}v.html`, {
        mode: "no-cors",
        cache: "no-store",
        credentials: "omit",
        keepalive: true
    }).catch(() => {
        // Ignored
    });
}

countVisit();
