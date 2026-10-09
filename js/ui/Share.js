import { SITE_URL } from "../constants.js";
import { trackEvent } from "../analytics.js";

// Partage sans script tiers : feuille de partage du téléphone si disponible,
// sinon pop-in avec des liens de partage simples (aucun cookie, aucun traçage)

const DEFAULT_TEXT = "Déconcentrés : le seul jeu où perdre sa concentration est une victoire. " +
    "Un jeu sur la concentration des médias en France.";

const NETWORKS = [
    { id: "bluesky", name: "Bluesky", url: (text, url) => `https://bsky.app/intent/compose?text=${encodeURIComponent(`${text} ${url}`)}` },
    { id: "whatsapp", name: "WhatsApp", url: (text, url) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { id: "threads", name: "Threads", url: (text, url) => `https://www.threads.net/intent/post?text=${encodeURIComponent(`${text} ${url}`)}` },
    { id: "facebook", name: "Facebook", url: (text, url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    { id: "linkedin", name: "LinkedIn", url: (text, url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}` }
];

let dialog = null;

// Boutons data-share : texte par défaut, ou data-share-text (ex. score en fin de partie)
export function initShareButtons() {
    for (const button of document.querySelectorAll("[data-share]")) {
        button.addEventListener("click", () => share(button.dataset.shareText || DEFAULT_TEXT));
    }
}

export async function share(text) {
    // Téléphone : feuille de partage native (WhatsApp, Signal, Instagram, SMS…)
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
        try {
            await navigator.share({ title: "Déconcentrés", text, url: SITE_URL });
            trackEvent("partage-natif", "Partage : feuille du téléphone");
            return;
        } catch (error) {
            if (error.name === "AbortError") return;
        }
    }

    openDialog(text);
}

function openDialog(text) {
    dialog ??= createDialog();

    dialog.querySelector(".share-text").textContent = `${text} ${SITE_URL}`;

    for (const link of dialog.querySelectorAll("[data-network]")) {
        const network = NETWORKS.find(item => item.id === link.dataset.network);
        link.href = network.url(text, SITE_URL);
    }

    const copy = dialog.querySelector(".share-copy");
    copy.dataset.text = `${text} ${SITE_URL}`;
    dialog.querySelector(".share-status").textContent = "";

    dialog.showModal();
}

function createDialog() {
    const element = document.createElement("dialog");
    element.className = "rules-dialog share-dialog";
    element.setAttribute("aria-labelledby", "share-title");
    element.innerHTML = `
        <div class="rules-header">
            <h2 id="share-title">Partager</h2>
            <button class="rules-close" type="button" aria-label="Fermer">×</button>
        </div>
        <div class="rules-content">
            <p class="share-text"></p>
            <div class="share-links">
                ${NETWORKS.map(network => `
                    <a class="share-link" data-network="${network.id}" target="_blank" rel="noopener">
                        ${network.name} <span aria-hidden="true">↗</span>
                        <span class="visually-hidden">(nouvel onglet)</span>
                    </a>`).join("")}
                <button type="button" class="share-link share-copy">Copier le message</button>
            </div>
            <p class="share-status" role="status"></p>
        </div>`;

    element.querySelector(".rules-close").addEventListener("click", () => element.close());

    // Clic sur le backdrop : fermeture
    element.addEventListener("click", event => {
        if (event.target === element) element.close();
    });

    for (const link of element.querySelectorAll("[data-network]")) {
        link.addEventListener("click", () => {
            trackEvent(`partage-${link.dataset.network}`, `Partage : ${link.textContent.trim().split(" ")[0]}`);
        });
    }

    element.querySelector(".share-copy").addEventListener("click", async event => {
        const status = element.querySelector(".share-status");

        const copied = await copyText(event.currentTarget.dataset.text);

        status.dataset.state = copied ? "success" : "error";
        status.textContent = copied
            ? "Message copié !"
            : "La copie a échoué : sélectionner le message ci-dessus pour le copier.";

        if (copied) trackEvent("partage-copie", "Partage : message copié");
    });

    document.body.appendChild(element);

    return element;
}

// Presse-papiers, avec repli sur l'ancienne méthode si l'API est refusée
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";
        dialog.appendChild(area);
        area.select();

        const copied = document.execCommand("copy");
        area.remove();

        return copied;
    }
}
