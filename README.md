# Lumos CRM Agent Local Bridge 🐍

A local integration hub and multi-agent routing system that securely connects a browser-based CRM development canvas directly to local execution environments. This repository implements a robust FastAPI backend capable of data sanitization, regulatory policy evaluation, accessibility auditing, and safe HTML mail template compilation.

---

## 🚀 Technical Highlights & Features

*   **FastAPI Local Loopback Core:** Low-latency local bridge exposing endpoints designed to securely process payloads from web execution spaces.
*   **Cross-Origin Resource Sharing (CORS) Configuration:** Tailored middleware enabling smooth loopback communication directly via secure browser sandboxes.
*   **Multi-Agent Orchestration Nodes (ADK):**
    *   **Data Sanitizer:** Uses regex pipelines and structural parsing to repair user payload syntax and construct high-safety greeting fallbacks.
    *   **Regulatory Compliance Analyst:** Automatically evaluates target markets (including strict **EU GDPR 2026**, **UWG 2026**, **CNIL**, and **CCPA/CPRA**) to strip tracking pixels, log consent compliance timestamps, and inject localized legal footers.
    *   **Accessibility Auditor:** Validates typography layout, screen reader compliance tags (`lang="de"`, `lang="fr"`), and enforces high contrast standards (WCAG 2.1 AA compliant).
    *   **HTML Compiler:** Programmatically outputs cleanly formatted, responsive email payloads using localized brand guidelines.
*   **Model Context Protocol (MCP) Integration:** Features a fully compliant `mcp_server.py` implementation to expose internal automation capabilities to modern LLM clients.
*   **Antigravity Agent Skills:** Embeds explicit configuration blueprints under `.antigravity/skills/crm-compliance-guardrail/` to govern strict regulatory workflows.

---

## 🛠️ Tech Stack & Prerequisites

*   **Backend Framework:** Python 3.12+ / FastAPI
*   **Server Gateway:** Uvicorn (Asynchronous Server Gateway Interface)
*   **Data Validation:** Pydantic v2 (Strict type-matching and verification models)
*   **Package Management:** pip

---

## 📦 Quickstart Installation & Setup

### 1. Clone & Initialize the Repository

git clone [https://github.com/clairedebadts-cloud/lumos-crm-agent.git](https://github.com/clairedebadts-cloud/lumos-crm-agent.git)
cd lumos-crm-agent

### 2. Install Project Dependencies
Ensure your environment or virtual workspace is active, then run:

pip install fastapi uvicorn pydantic
### 3. Launch the Local Bridge Server
To ensure compatibility with web-browser canvas environments and bypass security constraints, bind the host to 0.0.0.0 on your chosen port:

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

## 🧪 Local Verification & API Endpoints
Once the server logs Application startup complete, verify the system status by accessing the integrated health router:

Health Check URL: http://localhost:8000/api/health

Sample Response:

JSON
{
  "status": "online",
  "agent": "Lumos CRM Agent",
  "local_path": "/Users/*******/lumos-crm-agent",
  "version": "1.0.0-stable"
}
Connecting to the Sandbox Canvas
Set the Execution Core toggle in your browser interface to Local Link.

Input your endpoint entry configuration: http://localhost:8000 or http://localhost:8000 (depending on browser loopback rules).

Click Test Link. Once the connection validator changes to green, execute the system payloads!
