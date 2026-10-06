// Icônes des effets (SVG, currentColor)

const svg = paths =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" ` +
    `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

export const EFFECT_ICONS = {
    // croix
    cross: svg(`<path d="M12 4v16M4 12h16"/>`),

    // loupe
    square: svg(`<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>`),

    // réseau rompu
    dismantle: svg(
        `<g fill="currentColor" stroke="none">` +
        `<circle cx="11.8" cy="12.4" r="3.1"/>` +
        `<circle cx="3.6" cy="5.4" r="2.1"/><circle cx="18.8" cy="3.2" r="2.1"/>` +
        `<circle cx="5.2" cy="20.6" r="2.1"/><circle cx="20.9" cy="17.6" r="2.1"/>` +
        `</g>` +
        `<path stroke-width="1.8" d="M9.4 10.4L8.7 9.7M6 7.4L5.2 6.8M13.7 9.9L14.5 8.8M16.7 6L17.5 4.9` +
        `M9.9 14.8L9.3 15.5M7.1 18.3L6.5 19M14.5 13.9L15.2 14.4M18.3 16.1L19.1 16.6"/>`
    )
};

// Badge d'effet
export function createEffectBadge(effect, className) {
    const badge = document.createElement("span");

    badge.className = `${className} indep-${effect}`;
    badge.innerHTML = EFFECT_ICONS[effect] ?? "";

    return badge;
}
