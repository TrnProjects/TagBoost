// 🔘 Klik na ikonu ekstenzije otvara popup u posebnom prozoru
chrome.action.onClicked.addListener(() => {
    chrome.windows.create({
        url: chrome.runtime.getURL("popup.html"),
        type: "popup",
        width: 400,
        height: 500
    }, (newWindow) => {
        console.log("🖼️ Popup otvoren u posebnom prozoru:", newWindow);
    });
});

// 🔁 Osluškujemo vezu iz popup.js
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup_port") {
        console.log("✅ Popup povezan s background.js!");

        // 🎧 Osluškujemo poruke koje popup šalje
        port.onMessage.addListener((msg) => {
            console.log("📨 Primljena poruka iz popupa:", msg);

            // 🌐 Pronađi Redbubble upload tab
            chrome.tabs.query({
                url: "https://www.redbubble.com/portfolio/images/new*"
            }, (tabs) => {
                if (tabs.length === 0) {
                    console.error("❌ Nema otvorenog Redbubble taba za upload!");
                    return;
                }

                const tabId = tabs[0].id;
                console.log("🎯 Redbubble tab ID pronađen:", tabId);

                // 💬 Definiranje poruke za content.js
                let messageToSend = null;

                // 📝 Priprema poruke ovisno o tipu
                switch (msg.type) {
                    case "SEND_TITLE":
                        messageToSend = { type: "SEND_TITLE", data: msg.payload };
                        break;
                    case "SEND_DESCRIPTION":
                        messageToSend = { type: "SEND_DESCRIPTION", data: msg.payload };
                        break;
                    case "SEND_TAGS":
                        messageToSend = { type: "SEND_TAGS", data: msg.payload };
                        break;
                    case "SEND_ALL":
                        messageToSend = {
                            type: "SEND_ALL",
                            data: {
                                title: msg.payload.title,
                                description: msg.payload.description,
                                tags: msg.payload.tags
                            }
                        };
                        break;
                    default:
                        console.warn("⚠ Nepoznat tip poruke:", msg.type);
                        return;
                }

                // 📬 Slanje poruke prema content.js
                chrome.tabs.sendMessage(tabId, messageToSend, (res) => {
                    if (chrome.runtime.lastError) {
                        console.error("❌ Greška pri slanju poruke content.js-u:", chrome.runtime.lastError);
                    } else {
                        console.log("✅ Poruka uspješno poslana content.js-u:", messageToSend.type);
                    }
                });
            });
        });
    }
});
