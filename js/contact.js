// Formulaire de contact : envoi à Web3Forms sans quitter la page,
// avec un message de confirmation ou d'erreur sous le bouton
const PLACEHOLDER_KEY = "VOTRE_CLE_WEB3FORMS";

const form = document.getElementById("contact-form");
const status = document.getElementById("contact-status");
const submit = form.querySelector('button[type="submit"]');

function showStatus(state, text) {
    status.dataset.state = state;
    status.textContent = text;
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    if (form.elements.access_key.value === PLACEHOLDER_KEY) {
        showStatus("error", "Le formulaire n'est pas encore configuré : le message n'a pas été envoyé.");
        return;
    }

    submit.disabled = true;
    showStatus("pending", "Envoi en cours…");

    try {
        const response = await fetch(form.action, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message);
        }

        form.reset();
        showStatus("success", "Merci, votre message a bien été envoyé !");
    } catch {
        showStatus("error", "Le message n'a pas pu être envoyé. Réessayez un peu plus tard.");
    } finally {
        submit.disabled = false;
    }
});
