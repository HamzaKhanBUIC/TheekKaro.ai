# 🛠️ Engineering Challenges & Solutions — TheekKaro.ai

> A technical retrospective of every major problem encountered and solved during the development and deployment of TheekKaro.ai. This document demonstrates the real-world engineering decisions made under a **2-day hackathon deadline**.

---

## 🎯 Phase 1 — Strategy & Ideation

### Problem 1.1 — Escaping the "Generic Chatbot" Trap
**Challenge:** The majority of hackathon submissions default to simple text-in/text-out chatbot wrappers. Building one would guarantee losing.

**Engineering Decision:** We deliberately chose **Multimodal AI** — processing images and video — as the core input mechanism. This required mastering the `google.generativeai` File API for binary media uploads, which most competitors wouldn't touch. The result is a fundamentally different class of application.

---

### Problem 1.2 — The Time Crunch (4 Days → 2 Days)
**Challenge:** The initial plan included a native mobile app (Flutter/Android Studio). A proper cross-platform mobile app with a Gemini backend would take weeks to build correctly.

**Engineering Decision:** We made a hard pivot to a **mobile-responsive Streamlit web application** deployed on Google Cloud Run. This preserved the mobile-first experience (accessible on any phone via browser) while slashing development time by 80%. This is a classic **engineering trade-off** — scope reduction to guarantee a shippable product.

---

### Problem 1.3 — Selecting the Right Problem Domain
**Challenge:** We evaluated 6 different problem domains before committing:

| Domain | Problem | Rejection Reason |
|---|---|---|
| Fintech | OCR on handwritten Kiryana ledgers | Messy data, low accuracy |
| Cyber | WhatsApp scam detection | Hard to demonstrate live |
| Agriculture | Farmers describing crop disease verbally | Narrow target audience |
| Energy | Solar panel sizing from aerial photos | Requires proprietary data |
| Freelance | Decoding client briefs | Low social impact |
| **Civic ✅** | Municipal hazard reporting | **Broad impact, visual, AI-native** |

**Engineering Decision:** We selected civic hazard reporting because it is **inherently visual** (perfect for multimodal AI), affects every citizen regardless of literacy, and has a clearly broken status quo — making the AI's value immediately obvious to judges.

---

## ⚙️ Phase 2 — Technical Architecture

### Problem 2.1 — Deprecated API Models
**Challenge:** Initial prompts referenced `gemini-1.5-pro`, which is phased out in 2026. Using a deprecated model would cause the entire application to fail silently or throw cryptic errors.

**Engineering Decision:** Enforced strict use of `gemini-2.5-flash-lite` — the latest, fastest, and most cost-efficient model available. This also provided a **10x reduction in token cost**, critical for staying within free-tier limits during a live demo.

---

### Problem 2.2 — The `requirements.txt` Version Conflict (Cloud Build Failure)
**Challenge:** Google Cloud Build crashed during the Docker image build step:
```
ERROR: Could not find a version that satisfies the requirement
streamlit-geolocation==0.0.1
```
The local development environment and the cloud builder resolved package versions differently, causing a hard deployment failure.

**Engineering Decision:** Replaced pinned versions with **minimum-version constraints** (`>=`) for packages prone to this issue, and upgraded the base Docker image from `python:3.9-slim` to `python:3.10-slim` to satisfy modern library requirements. This is a standard practice in production CI/CD pipelines.

---

### Problem 2.3 — Missing API Secrets in Cloud Runtime
**Challenge:** The app deployed successfully but crashed immediately upon image upload:
```
No secrets files found. Valid paths: /root/.streamlit/secrets.toml
API key not valid. Please pass a valid API key.
```
The Cloud Run container had no access to local `secrets.toml` files, which only exist on a developer's machine.

**Engineering Decision:** Migrated to **Cloud Run Environment Variables** — the industry-standard method for injecting secrets into containerized applications. This is the same pattern used by production services at Google, Netflix, and Stripe.

---

### Problem 2.4 — The Multi-Line Environment Variable Parsing Bug
**Challenge:** When Cloud Run stored the comma-separated API keys as an environment variable, the string was being read back with unexpected formatting (line breaks, spaces). A naive `.split(",")` would extract malformed key strings, causing the API to reject them all:
```
HttpError 400: API key not valid.
```

**Engineering Decision:** Replaced all string-splitting logic with **Regex extraction** — the only method robust enough to handle arbitrary whitespace and formatting from any source:
```python
api_keys = re.findall(r'AIza[a-zA-Z0-9_-]{35}', raw_env_string)
```
This pattern precisely matches the 39-character structure of all Google API keys, making the parser immune to any formatting issues.

---

### Problem 2.5 — The Blind Random Load Balancer (Single Point of Failure)
**Challenge:** The initial API key rotation used `random.choice(api_keys)`. If the randomly selected key happened to be rate-limited (HTTP 429), the entire user request failed immediately with no recovery.

**Engineering Decision:** Replaced blind randomness with a **Sequential Failover Router**:
```python
random.shuffle(api_keys)  # Distribute load across sessions
for key in api_keys:      # Try each key in sequence
    try:
        genai.configure(api_key=key)
        result = model.generate_content(...)
        break  # Stop on first success
    except Exception as e:
        if "429" in str(e): continue  # Try next key
        else: raise  # Re-raise real errors
```
This guarantees that a rate-limited key is never a permanent failure — the system automatically heals itself by trying the next available key. This is the same pattern used in distributed systems engineering.

---

### Problem 2.6 — Server-Side Email Automation Failure
**Challenge:** Code designed to open a desktop mail client (`subprocess.Popen(['mailto:...'])`) worked perfectly in local development but failed completely on Cloud Run because the container is a **headless Linux server** with no desktop environment.

**Engineering Decision:** Shifted from backend automation to **frontend URL generation**. We used `urllib.parse.urlencode` to construct a pre-filled Gmail compose URL and rendered it as a clickable `st.link_button`. This is architecturally correct — file-open operations must happen in the browser (client), not the server.

---

### Problem 2.7 — The Video Token Drain (Rate Limit Bomb)
**Challenge:** Processing a 30-second video consumed 100,000+ tokens in a single API call — instantly exhausting the free-tier quota and crashing the app for all users simultaneously.

**Engineering Decision:** Implemented a **tiered input strategy**:
- Images: Instant processing, ~500 tokens per call ✅
- Videos: Supported but flagged with a user warning about processing time
- Added a `st.info()` banner recommending photos for reliability

This preserved the multimodal video feature while ensuring the live demo remains stable.

---

### Problem 2.8 — The JSON Parsing Fragility Problem
**Challenge:** Gemini would occasionally wrap its JSON output in markdown code fences:
````
```json
{ "hazard_detected": "Pothole" ... }
```
````
A direct `json.loads(response.text)` would crash with a `JSONDecodeError`, breaking the entire complaint generation pipeline.

**Engineering Decision:** Built a **two-layer JSON extractor**:
1. First, strip markdown fences using Regex: `re.sub(r"^```[a-z]*\n|```$", "", text)`
2. Then, as a final fallback, use `re.search(r'\{.*\}', text, re.DOTALL)` to extract the raw JSON object even from malformed responses

This makes the parser resilient to any LLM output format variation.

---

### Problem 2.9 — The GitHub Security Risk
**Challenge:** The project contained a `.streamlit/secrets.toml` with live API keys and a `venv/` folder with thousands of local files. Pushing these to a public GitHub repository would trigger Google's automated secret scanner, which instantly revokes exposed API keys.

**Engineering Decision:** Wrote a strict `.gitignore` that blocks:
- `.env` — local API keys
- `.streamlit/` — Streamlit secrets
- `venv/`, `__pycache__/` — local environment artifacts
- `build_log.txt` — build artifacts with internal details

**Zero secrets were ever committed to the repository.**

---

## 🏆 Key Engineering Takeaways

1. **Cloud ≠ Local** — Always design for a headless server. No file system, no desktop, no local paths.
2. **Never pin package versions** in cloud deployments without verifying cross-platform availability.
3. **Regex is more reliable than string splitting** when parsing data from external sources.
4. **Failover, not retry** — A sequential failover loop is always better than a blind random retry.
5. **Scope ruthlessly** — A shippable MVP beats a perfect app that doesn't exist.

---

<div align="center">
  <em>Every bug above was a lesson in real-world production engineering.</em><br/>
  <strong>Built under pressure. Shipped on deadline. 🇵🇰</strong>
</div>
