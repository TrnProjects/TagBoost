console.log("🟢 Autofill content.js učitan!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Poruka primljena u autofill-content.js:", message);

    if (message.type === "INSERT_TEXT") {
        let inputField = document.querySelector("input[name='title'], input[type='text']");
        if (inputField) {
            inputField.value = message.data;
            console.log("✅ Unesen tekst:", message.data);
            sendResponse({ status: "SUCCESS" });
        } else {
            console.warn("⚠ Nije pronađeno polje za unos!");
            sendResponse({ status: "FAIL" });
        }
    }
});
