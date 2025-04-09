console.log("✅ TagBoost Background Script Loaded");

let popupWindowId = null;

chrome.action.onClicked.addListener(() => {
    if (popupWindowId) {
        chrome.windows.update(popupWindowId, { focused: true });
    } else {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: 500,
            height: 700,
            top: 100,
            left: 300,
            focused: true
        }, (window) => {
            popupWindowId = window.id;

            chrome.windows.onRemoved.addListener((closedWindowId) => {
                if (closedWindowId === popupWindowId) {
                    popupWindowId = null;
                }
            });
        });
    }
});

// 🎯 Primamo poruke iz popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📨 Poruka primljena u background.js:", message);

    const allowedTypes = ["SEND_TITLE", "SEND_DESCRIPTION", "SEND_TAGS", "SEND_ALL"];
    if (!allowedTypes.includes(message.type)) {
        console.warn("⚠️ Nepodržan tip poruke:", message.type);
        return true; // i dalje tu može ostati
    }

    // 🔍 Nađi aktivni tab s Redbubble upload formom
    chrome.tabs.query({
        url: [
            "https://www.redbubble.com/portfolio/images/new*",
            "https://redbubble.com/portfolio/images/new*",
            "https://www.redbubble.com/portfolio/images/*",
            "https://redbubble.com/portfolio/images/*"
        ]
    }, (tabs) => {
        if (tabs.length === 0) {
            console.error("❌ Nema otvorenog Redbubble taba za upload!");
            return;
        }

        const tabId = tabs[0].id;

        // 📤 Prosljeđujemo poruku prema content.js
        chrome.tabs.sendMessage(tabId, message, (response) => {
            if (chrome.runtime.lastError) {
                console.error("❌ Greška u komunikaciji s content.js:", chrome.runtime.lastError);
            } else {
                console.log("✅ Poruka proslijeđena content.js-u:", response);
            }
        });
    });

    // ✅ OVO je ključno za ispravnu asinkronu komunikaciju
    return true;
});
