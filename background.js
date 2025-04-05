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
