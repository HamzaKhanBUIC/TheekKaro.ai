# 🇵🇰 TheekKaro.ai — AI-Powered Civic Complaint System

<div align="center">

![TheekKaro.ai Banner](app_mockup.png)

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Google_Cloud_Run-4285F4?style=for-the-badge)](https://theekkaro-engine-900492834451.us-central1.run.app)
[![Built with Gemini](https://img.shields.io/badge/Powered_by-Gemini_AI-EA4335?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.33-FF4B4B?style=for-the-badge&logo=streamlit&logoColor=white)](https://streamlit.io)
[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Run-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com/run)

**Transforming citizen complaints into official civic action — instantly.**

*Submitted for the AI Seekho 2026 Online Challenge*

</div>

---

## 🌟 The Problem

Every day, millions of Pakistani citizens encounter broken streetlights, dangerous potholes, overflowing waste, and crumbling infrastructure. The biggest barrier to fixing these problems isn't the issues themselves — it's the **frustrating, bureaucratic process** of reporting them. Citizens don't know:

- ❓ Which department to contact
- ❓ What the official email address is
- ❓ How to write a formal complaint in English *or* Urdu

**TheekKaro.ai solves all three problems in under 30 seconds.**

---

## 💡 The Solution

TheekKaro.ai is a **multimodal AI civic reporting platform**. A citizen simply:

1. 📸 **Photographs** the civic hazard (pothole, broken light, garbage, etc.)
2. 📍 **Shares their GPS location** (one tap)
3. 🤖 **Gets an AI-generated official complaint** — in both English and Urdu — addressed to the exact relevant authority

The app automatically identifies the correct government department, finds their official contact email, and generates a professional, ready-to-send complaint letter.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🖼️ **Multimodal Analysis** | Upload images or videos of civic hazards for AI analysis |
| 📍 **GPS Auto-Detection** | Reverse geocoding to automatically detect street-level address |
| 🤖 **AI Authority Routing** | Gemini AI identifies the exact responsible department |
| 📧 **Dual-Language Output** | Generates formal complaints in both English and Urdu |
| 📄 **DOCX Export** | Download the complaint as a ready-to-send Word document |
| 📬 **One-Tap Email** | Pre-filled `mailto:` link to send complaint instantly |
| ⚡ **3-Key API Rotation** | Intelligent load balancing across multiple API keys to prevent rate limiting |
| 📱 **Mobile-First Design** | Fully responsive for citizens reporting in the field |

---

## 🏗️ Tech Stack

```
Frontend:   Streamlit + Custom Material Design CSS
AI Engine:  Google Gemini 2.5 Flash Lite (Multimodal)
Geocoding:  Geopy + Nominatim (OpenStreetMap)
Export:     python-docx
Deployment: Google Cloud Run (Containerized with Docker)
```

---

## 🚀 Running Locally

### Prerequisites
- Python 3.10+
- A Google Gemini API Key ([Get one free](https://aistudio.google.com/))

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/HamzaKhanBUIC/TheekKaro.ai.git
cd TheekKaro.ai

# 2. Create a virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure your API key
# Create a file at .streamlit/secrets.toml and add:
# GEMINI_API_KEYS = "YOUR_API_KEY_HERE"

# 5. Run the app
streamlit run app.py
```

---

## ☁️ Deployment (Google Cloud Run)

```bash
# Deploy directly from source
gcloud run deploy theekkaro-engine \
  --source . \
  --set-env-vars GEMINI_API_KEYS=YOUR_KEY_1,YOUR_KEY_2 \
  --region us-central1 \
  --allow-unauthenticated
```

---

## 🔒 Security Notes

- **API keys are never stored in the codebase.** They are injected via Cloud Run environment variables at runtime.
- The `.env` file is blocked by `.gitignore` and will never be committed.
- Key rotation uses Regex extraction for maximum robustness against formatting issues.

---

## 👨‍💻 About the Developer

<table>
  <tr>
    <td><img src="dev_avatar.png" width="80" style="border-radius:50%"/></td>
    <td>
      <strong>Hamza Imran</strong><br/>
      BS Cyber Security — Air University Islamabad (2nd Semester)<br/>
      <a href="https://www.linkedin.com/in/hamza-imran-17569b383">LinkedIn</a> •
      <a href="https://github.com/HamzaKhanBUIC">GitHub</a> •
      <a href="mailto:hamza135252@gmail.com">hamza135252@gmail.com</a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<div align="center">
  <strong>Built with ❤️ for Pakistan 🇵🇰</strong><br/>
  <em>AI Seekho 2026 Hackathon Submission</em>
</div>
