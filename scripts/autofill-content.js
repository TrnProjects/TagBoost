console.log("🟢 [autofill-content.js] Učitano i spremno za primanje podataka!");

// Osluškuje poruke iz background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Primljena poruka u content scriptu:", message);

    if (message.type === "INSERT_TEXT") {
        const { title, description, tags } = message.data;

        // ⚠️ Selektori za Redbubble upload stranicu
        const titleField = document.querySelector("input[name='title'], input[type='text']");
        const descriptionField = document.querySelector("textarea[name='description'], textarea");
        const tagsField = document.querySelector("input[name='tags'], input[type='text']:not([name])");

        // Provjera polja
        if (!titleField || !descriptionField || !tagsField) {
            console.warn("❌ Neka od polja nisu pronađena! Možda DOM još nije učitan.");
            sendResponse({ status: "fail", error: "Fields not found" });
            return;
        }

        // Unos podataka + trigger 'input' event
        titleField.value = title;
        titleField.dispatchEvent(new Event("input", { bubbles: true }));

        descriptionField.value = description;
        descriptionField.dispatchEvent(new Event("input", { bubbles: true }));

        tagsField.value = tags.join(", ");
        tagsField.dispatchEvent(new Event("input", { bubbles: true }));

        console.log("✅ Uspješno uneseni podaci u Redbubble formu!");
        sendResponse({ status: "success" });
    }
});
