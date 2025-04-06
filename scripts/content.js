console.log("🟢 TagBoost_Main content.js učitan!");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("📩 Poruka primljena u content.js:", message);

    if (message.type === "SEND_TITLE") {
        const titleField = document.querySelector("input#work_title_en");
        if (titleField) {
            titleField.value = message.payload;
            titleField.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("✅ Title postavljen:", message.payload);
            sendResponse({ status: "SUCCESS" });
        } else {
            console.warn("⚠ Title polje nije pronađeno.");
            sendResponse({ status: "FAIL" });
        }
    }

    if (message.type === "SEND_DESCRIPTION") {
        const descriptionField = document.querySelector("textarea#work_description_en");
        if (descriptionField) {
            descriptionField.value = message.payload;
            descriptionField.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("✅ Description postavljen:", message.payload);
            sendResponse({ status: "SUCCESS" });
        } else {
            console.warn("⚠ Description polje nije pronađeno.");
            sendResponse({ status: "FAIL" });
        }
    }

    if (message.type === "SEND_TAGS") {
        const tagsField = document.querySelector("textarea#work_tag_field_en");
        if (tagsField) {
            tagsField.value = message.payload;
            tagsField.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("✅ Tagovi postavljeni:", message.payload);
            sendResponse({ status: "SUCCESS" });
        } else {
            console.warn("⚠ Tags polje nije pronađeno.");
            sendResponse({ status: "FAIL" });
        }
    }

    if (message.type === "SEND_ALL") {
        let successCount = 0;

        const titleField = document.querySelector("input#work_title_en");
        if (titleField) {
            titleField.value = message.payload.title;
            titleField.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("✅ Title (SEND_ALL):", message.payload.title);
            successCount++;
        } else {
            console.warn("⚠ Title nije postavljen (SEND_ALL).");
        }

        const descriptionField = document.querySelector("textarea#work_description_en");
        if (descriptionField) {
            descriptionField.value = message.payload.description;
            descriptionField.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("✅ Description (SEND_ALL):", message.payload.description);
            successCount++;
        } else {
            console.warn("⚠ Description nije postavljen (SEND_ALL).");
        }

        const tagsField = document.querySelector("textarea#work_tag_field_en");
        if (tagsField) {
            tagsField.value = message.payload.tags;
            tagsField.dispatchEvent(new Event("input", { bubbles: true }));
            console.log("✅ Tags (SEND_ALL):", message.payload.tags);
            successCount++;
        } else {
            console.warn("⚠ Tags nisu postavljeni (SEND_ALL).");
        }

        sendResponse({
            status: successCount === 3 ? "SUCCESS" : "PARTIAL_SUCCESS",
            fieldsSet: successCount
        });
    }

    return true;
});
