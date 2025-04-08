document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 TagBoost Popup Loaded!");

    const themeSelector = document.getElementById("theme-select");
    const themeStylesheet = document.getElementById("theme-stylesheet");
    const body = document.body;

    // ✅ Glatka promjena teme
    body.style.transition = "opacity 0.5s ease-in-out";

    // ✅ Učitavanje spremljene teme iz Chrome Storage-a
    chrome.storage.sync.get("selectedTheme", function (data) {
        if (data.selectedTheme) {
            themeStylesheet.href = data.selectedTheme;
            if (themeSelector)
                themeSelector.value = data.selectedTheme.replace("styles/", "").replace(".css", "");
        }
    });

    // ✅ Promjena veličine prozora
    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === "resize") {
            document.documentElement.style.width = message.width + "px";
            document.documentElement.style.height = message.height + "px";
            document.body.style.width = message.width + "px";
            document.body.style.height = message.height + "px";
            const popupContainer = document.querySelector(".popup-container");
            if (popupContainer) {
                popupContainer.style.width = "100%";
                popupContainer.style.height = "100%";
            }
        }
    });

    // ✅ Odabir nove teme
    if (themeSelector) {
        themeSelector.addEventListener("change", function () {
            const selectedTheme = themeSelector.value;
            const newThemePath = `styles/${selectedTheme}.css`;

            body.style.opacity = "0";

            setTimeout(() => {
                if (themeStylesheet) themeStylesheet.href = newThemePath;

                chrome.storage.sync.set({ "selectedTheme": newThemePath }, function () {
                    console.log("✅ Nova tema spremljena:", newThemePath);
                });

                body.style.opacity = "1";
            }, 500);
        });
    }

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("image-upload");
    const imagePreview = document.getElementById("image-preview");
    const fillDataButton = document.getElementById("fillData");
    const titleField = document.getElementById("title");
    const descriptionField = document.getElementById("description");
    const tagsField = document.getElementById("tags");
    const sendToSiteButton = document.getElementById("bulk-send");

    let uploadedImage = null;
    const apiKey = "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"; // 🔐 Zamijeni s pravim API ključem

    document.getElementById("regen-title").addEventListener("click", () => {
        regenerate("title");
    });
    document.getElementById("regen-description").addEventListener("click", () => {
        regenerate("description");
    });
    document.getElementById("regen-tags").addEventListener("click", () => {
        regenerate("tags");
    });
    document.getElementById("send-title").addEventListener("click", () => {
        sendToSite("title");
    });
    document.getElementById("send-description").addEventListener("click", () => {
        sendToSite("description");
    });
    document.getElementById("send-tags").addEventListener("click", () => {
        sendToSite("tags");
    });


    // 📌 Drag & Drop funkcionalnost
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
        dropArea.addEventListener(eventName, (event) => {
            event.preventDefault();
            event.stopPropagation();
        });
    });

    dropArea.addEventListener("dragover", () => dropArea.classList.add("dragover"));
    dropArea.addEventListener("dragleave", () => dropArea.classList.remove("dragover"));

    dropArea.addEventListener("drop", (event) => {
        dropArea.classList.remove("dragover");
        if (event.dataTransfer.files.length > 0) {
            handleFile(event.dataTransfer.files[0]);
        }
    });

    dropArea.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });

    function handleFile(file) {
        if (!file.type.startsWith("image/")) {
            console.error("❌ Odabrana datoteka nije slika!");
            return;
        }

        resizeImage(file, 1024, 1024, function (resizedBase64Image) {
            uploadedImage = resizedBase64Image;
            imagePreview.src = `data:image/jpeg;base64,${resizedBase64Image}`;
            imagePreview.style.display = "block";
            console.log("✅ Slika učitana u popup.");
        });
    }

    fillDataButton.addEventListener("click", () => {
        if (!uploadedImage) {
            console.error("❌ Nema učitane slike!");
            alert("⚠️ Molimo učitajte sliku prije analize!");
            return;
        }
        fetchOpenAIAnalysis(uploadedImage);
    });

    async function fetchOpenAIAnalysis(base64Image) {
        console.log("📤 Šaljem sliku na OpenAI analizu...");

        if (!base64Image) {
            console.error("❌ Greška: Slika nije dostupna!");
            return;
        }

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo",
                    messages: [
                        {
                            "role": "system",
                            "content": "You are an AI trained to generate concise and SEO-optimized product listings for artwork on Etsy and Redbubble. Follow the given format strictly."
                        },
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "text",
                                    "text": `Analyze this image and generate a product listing in the following strict format:
        
                                        1️⃣ **Title:** A short, engaging, and relevant title for this artwork.
                                        
                                        2️⃣ **Description:** A single well-structured paragraph describing the artwork, focusing on its visual elements only. **Do not list** individual elements or features in bullet points. **Do not add material, printing, or shipping details**.
        
                                        3️⃣ **SEO Tags:** A list of comma-separated keywords that best describe this artwork. Do not use more than 12 tags.
        
                                        Ensure that the response strictly follows this format and does not contain any additional text.`
                                },
                                {
                                    "type": "image_url",
                                    "image_url": { "url": `data:image/jpeg;base64,${base64Image}` }
                                }
                            ]
                        }
                    ],
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} - ${response.statusText}`);
            }

            const result = await response.json();
            console.log("🤖 AI Response:", result);

            if (result.choices && result.choices.length > 0) {
                const aiContent = result.choices[0].message.content;
                console.log("📌 AI Text Response:", aiContent);

                // 📌 Ispravno parsiranje odgovora
                const titleMatch = aiContent.match(/1️⃣ \*\*Title:\*\* (.*)/);
                const descriptionMatch = aiContent.match(/2️⃣ \*\*Description:\*\* ([\s\S]*?)3️⃣ \*\*SEO Tags:\*\*/);
                const tagsMatch = aiContent.match(/3️⃣ \*\*SEO Tags:\*\* (.*)/);

                const title = titleMatch ? titleMatch[1].trim() : "";
                const description = descriptionMatch ? descriptionMatch[1].trim() : "";
                const tags = tagsMatch ? tagsMatch[1].trim().split(",").map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

                titleField.value = title;
                descriptionField.value = description;
                tagsField.value = tags.join(", ");

                console.log("📌 AI Response Title:", title);
                console.log("📌 AI Response Description:", description);
                console.log("📌 AI Response Tags:", tags);
                console.log("✅ Podaci uneseni u polja!");
            } else {
                console.error("❌ AI je vratio prazan odgovor!");
            }
        } catch (error) {
            console.error("⚠️ Greška pri dohvaćanju AI podataka:", error);
        }
    }
    // 🔁 Regeneracija pojedinačnih tekstualnih polja
    async function regenerateText(field, originalText) {
        console.log(`🔁 Regeneriram tekst za: ${field}`);
        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are an AI assistant trained to improve and rewrite product listing content for artwork. Respond only with the improved version, no explanations."
                        },
                        {
                            role: "user",
                            content: `Improve this ${field}:\n\n"${originalText}"`
                        }
                    ],
                    max_tokens: 300
                })
            });

            const result = await response.json();
            const newText = result.choices?.[0]?.message?.content?.trim();

            if (!newText) {
                console.error("❌ AI nije vratio novi tekst.");
                return;
            }

            // 🔁 Upisujemo novi tekst u odgovarajuće polje
            switch (field) {
                case "title":
                    titleField.dataset.original = titleField.value;
                    titleField.value = newText;
                    break;
                case "description":
                    descriptionField.dataset.original = descriptionField.value;
                    descriptionField.value = newText;
                    break;
                case "tags":
                    tagsField.dataset.original = tagsField.value;
                    tagsField.value = newText;
                    break;
            }

            console.log(`✅ Novi ${field} generiran:`, newText);

        } catch (err) {
            console.error("⚠️ Greška u regeneraciji teksta:", err);
        }
    }
    function regenerate(field) {
        let originalText = "";
        switch (field) {
            case "title":
                originalText = titleField.value;
                break;
            case "description":
                originalText = descriptionField.value;
                break;
            case "tags":
                originalText = tagsField.value;
                break;
            default:
                console.error("❌ Nepoznat field:", field);
                return;
        }

        regenerateText(field, originalText);
    }

    // 📌 Slanje podataka u Redbubble/Etsy polja
    sendToSiteButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({
            type: "SEND_ALL",
            payload: {
                title: titleField.value,
                description: descriptionField.value,
                tags: tagsField.value
            }
        });
        console.log("📤 Sva polja poslana preko background.js");
    });


    function resizeImage(file, maxWidth, maxHeight, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function () {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
                    width *= scaleFactor;
                    height *= scaleFactor;
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                const resizedBase64 = canvas.toDataURL("image/jpeg").split(",")[1];
                callback(resizedBase64);
            };
        };
    }
    function sendToSite(field) {
        let value = "";

        switch (field) {
            case "title":
                value = titleField.value;
                break;
            case "description":
                value = descriptionField.value;
                break;
            case "tags":
                value = tagsField.value;
                break;
            default:
                console.warn("Unknown field:", field);
                return;
        }

        chrome.runtime.sendMessage({
            type: "SEND_" + field.toUpperCase(),
            payload: value
        });

        console.log(`📤 Poslano polje: ${field} →`, value);
    }
});

