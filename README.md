# Lumos CRM Agent Local Bridge 🐍

A local integration hub and multi-agent routing system that securely connects a browser-based CRM development canvas directly to local execution environments. This repository implements a robust FastAPI backend capable of data sanitization, regulatory policy evaluation, accessibility auditing, and safe HTML mail template compilation.

---

## 🚀 Technical Highlights & Features

*   **FastAPI Local Loopback Core:** Low-latency local bridge exposing endpoints designed to securely process payloads from web execution spaces.
*   **Cross-Origin Resource Sharing (CORS) Configuration:** Tailored middleware enabling smooth loopback communication directly via secure browser sandboxes.
*   **Multi-Agent Orchestration Nodes:**
    *   **Data Sanitizer:** Uses regex pipelines and structural parsing to repair user payload syntax and construct high-safety greeting fallbacks.
    *   **Regulatory Compliance Analyst:** Automatically evaluates target markets (including strict **EU GDPR 2026**, **UWG 2026**, **CNIL**, and **CCPA/CPRA**) to strip tracking pixels, log consent compliance timestamps, and inject localized legal footers.
    *   **Accessibility Auditor:** Validates typography layout, screen reader compliance tags (`lang="de"`, `lang="fr"`), and enforces high contrast standards (WCAG 2.1 AA compliant).
    *   **HTML Compiler:** Programmatically outputs cleanly formatted, responsive responsive email payloads using localized brand guidelines.

---

## 🛠️ Tech Stack & Prerequisites

*   **Backend Framework:** Python 3.12+ / FastAPI
*   **Server Gateway:** Uvicorn (Asynchronous Server Gateway Interface)
*   **Data Validation:** Pydantic v2 (Strict type-matching and verification models)
*   **Package Management:** pip

