console.log("Popup.js učitan! ✅");

// 🔌 Spajamo se na background.js kroz named port
let port = chrome.runtime.connect({ name: "popup_port" });

// 🎯 Hvatamo input polja
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const tagsInput = document.getElementById("tagsInput");

// 📡 Inicijalna poruka - čisto da se potvrdi konekcija
port.postMessage({ type: "INIT_POPUP" });

// 🎧 Osluškujemo poruke iz background.js (debug)
port.onMessage.addListener((msg) => {
    console.log("Primljena poruka od background.js:", msg);
    if (msg.type === "ACK") {
        console.log("Background.js potvrdio vezu! ✅");
    }
});

// 🔌 Ako se port zatvori
port.onDisconnect.addListener(() => {
    console.warn("⚠ Port je zatvoren, komunikacija prekinuta.");
});

// 🆗 Gumb za slanje naslova
document.getElementById("sendTitle")?.addEventListener("click", () => {
    if (port) {
        port.postMessage({
            type: "SEND_TITLE",
            payload: titleInput.value
        });
        console.log("📨 Sent title:", titleInput.value);
    } else {
        console.warn("⚠ Port is not active!");
    }
});

// 🆕 Gumb za slanje opisa
document.getElementById("sendDescription")?.addEventListener("click", () => {
    if (port) {
        port.postMessage({
            type: "SEND_DESCRIPTION",
            payload: descriptionInput.value
        });
        console.log("📨 Sent description:", descriptionInput.value);
    } else {
        console.warn("⚠ Port is not active!");
    }
});

// 🆕 Gumb za slanje tagova
document.getElementById("sendTags")?.addEventListener("click", () => {
    if (port) {
        port.postMessage({
            type: "SEND_TAGS",
            payload: tagsInput.value
        });
        console.log("📨 Sent tags:", tagsInput.value);
    } else {
        console.warn("⚠ Port is not active!");
    }
});

// 🔁 Gumb za slanje svih podataka odjednom
document.getElementById("sendAll")?.addEventListener("click", () => {
    if (port) {
        const title = titleInput.value;
        const description = descriptionInput.value;
        const tags = tagsInput.value;

        port.postMessage({
            type: "SEND_ALL",
            payload: { title, description, tags }
        });

        console.log("📨 Sent all data:", { title, description, tags });
    } else {
        console.warn("⚠ Port is not active!");
    }
});
