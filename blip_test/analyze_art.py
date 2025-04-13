import requests
from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import torch
import re

# === 🖼️ BLIP generacija opisa ===
device = "cuda" if torch.cuda.is_available() else "cpu"
blip_model_id = "Salesforce/blip-image-captioning-base"
processor = BlipProcessor.from_pretrained(blip_model_id)
model = BlipForConditionalGeneration.from_pretrained(blip_model_id).to(device)

image = Image.open("P1014917.JPG").convert('RGB')
inputs = processor(image, "", return_tensors="pt").to(device)
out = model.generate(**inputs, max_new_tokens=100)
caption = processor.decode(out[0], skip_special_tokens=True)

print("\n🎨 Osnovni opis (BLIP):")
print(caption)

# === 🤖 Prompt za Mistral ===
prompt = f"""
You are an expert visual analyst and art critic.
Based on the image description below, write a detailed, artistic breakdown.

Image caption: "{caption}"

Return a description that includes:
- Artistic style and medium
- Mood and emotion
- Composition and elements
- Possible interpretation
Then list 20 relevant keywords.
"""

# === 🔗 Slanje prema lokalnom LLM (LM Studio) ===
response = requests.post(
    "http://127.0.0.1:1234/v1/chat/completions",
    headers={"Content-Type": "application/json"},
    json={
        "model": "mistral-7b-instruct-v0.2",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7,
        "max_tokens": 800
    }
)

output = response.json()["choices"][0]["message"]["content"]

print("\n🧠 Analiza slike (Mistral):\n")
print(output)

# === 💾 Spremi output u fajl
with open("analysis_output.txt", "w", encoding="utf-8") as f:
    f.write("🖼️ Caption (BLIP): " + caption + "\n\n")
    f.write(output)

# === 🧩 Izvuci 20 ključnih riječi
keywords = re.findall(r'\b[a-zA-Z]{4,}\b', output.lower())
keywords = list(set(keywords))[:20]

print("\n🔑 Ključne riječi:")
print(", ".join(keywords))
