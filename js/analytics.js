// Mesure d'audience GoatCounter (sans cookie) : événements du jeu.
// Le script de comptage est chargé par chaque page ; s'il est bloqué
// ou pas encore chargé, l'événement est simplement ignoré
export function trackEvent(name, title) {
    window.goatcounter?.count?.({ path: name, title, event: true });
}
