# 🚀 TagBoost – Chrome Extension for Redbubble Creators

**Current Version:** `Model T v0.2`  
**Status:** ✅ Stable & functional

---

## 🔧 What it does

TagBoost helps Redbubble sellers save time by automating the upload form.

### ✅ Current Features (Model T v0.2):
- Input field for **Title**, **Description**, and **Tags**
- Buttons to individually send data to Redbubble upload form
- "Upload All" button – sends all fields in one click
- Full internal communication: `popup.js → background.js → content.js`

---

## 🧠 Tech Behind the Scenes

- Chrome extension built with **Manifest V3**
- Modular architecture:
  - `popup.html + popup.js` – UI logic
  - `background.js` – router for messages
  - `content.js` – handles direct DOM manipulation on Redbubble
- Handles dynamic Redbubble elements using resilient querySelectors
- Designed to integrate with AI image-to-text analysis in Phase 2

---

## 🧱 Next Phases (Coming Soon)

1. **Phase 2 – AI Integration**
   - Upload image
   - Generate SEO-friendly title, description, tags
   - Autofill inputs from AI output

2. **Phase 3 – Design Upgrade**
   - Integrate themed popup layouts (dark / glitch / modern)

3. **Phase 4 – Advanced Features**
   - Auto-save previous generations
   - Keyword analysis & optimization
   - Scrap data from Redbubble / use Google Ads API

---

## ✍️ Authors

> **Developed by Ozzy & Lex**  
We're building tools that help creators automate what slows them down.

---

