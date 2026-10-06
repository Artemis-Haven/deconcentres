// Envoi du formulaire à Web3Forms en AJAX
const form = document.getElementById("contact-form");
const status = document.getElementById("contact-status");
const submit = form.querySelector('button[type="submit"]');

function showStatus(state, text) {
    status.dataset.state = state;
    status.textContent = text;
}

form.addEventListener("submit", async event => {
    event.preventDefault();

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
