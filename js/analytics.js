import { SITE_URL, VISITS_URL } from "./constants.js";

// Événements GoatCounter (ignorés si le script est bloqué)
export function trackEvent(name, title) {
    window.goatcounter?.count?.({ path: name, title, event: true });
}

// Statistiques serveur
export function sendToStats(path) {
    if (location.origin !== new URL(SITE_URL).origin) return;

    fetch(`${VISITS_URL}${path}`, {
        mode: "no-cors",
        cache: "no-store",
        credentials: "omit",
        keepalive: true
    }).catch(() => {
        // Ignored
    });
}
