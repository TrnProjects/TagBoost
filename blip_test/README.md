# Image Analysis (BLIP + Mistral 7B)
Ovaj modul koristi BLIP model za opis slike i lokalno pokrenuti Mistral 7B model za dublju analizu slike (stil, emocije, kompozicija, značenje i ključne riječi).

🚀 Sve se odvija lokalno, bez korištenja OpenAI API-ja.

🛠️ Potrebno:
- BLIP model (`Salesforce/blip-image-captioning-base`)
- Mistral model (.gguf) pokrenut kroz LM Studio na `http://127.0.0.1:1234`

📁 Struktura:
- `analyze_art.py` – glavni script
- `P1014917.jpg` – testna slika
- `analysis_output.txt` – uzorak rezultata
