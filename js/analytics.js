// Événements GoatCounter (ignorés si le script est bloqué)
export function trackEvent(name, title) {
    window.goatcounter?.count?.({ path: name, title, event: true });
}
