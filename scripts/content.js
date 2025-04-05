console.log("📌 TagBoost Content Script Loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "fillData") {
        console.log("📡 Primam podatke:", message);

        fillFields(message.title, message.description, message.tags);
        sendResponse({ success: true });
    }
});

function fillFields(title, description, tags) {
    const titleField = document.querySelector('input[name="title"]');
    const descriptionField = document.querySelector('textarea[name="description"]');
    const tagsField = document.querySelector('input[name="tags"]');

    if (!titleField || !descriptionField || !tagsField) {
        console.error("❌ Redbubble/Etsy polja nisu pronađena!");
        return;
    }

    titleField.value = title;
    titleField.dispatchEvent(new Event('input', { bubbles: true }));

    descriptionField.value = description;
    descriptionField.dispatchEvent(new Event('input', { bubbles: true }));

    tagsField.value = tags.join(", ");
    tagsField.dispatchEvent(new Event('input', { bubbles: true }));

    console.log("✅ SEO podaci uneseni u polja!");
}
