import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini SDK lazily to prevent crash if key is missing,
  // but check it on route execution
  let aiClient: GoogleGenAI | null = null;

  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is required");
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Global Multi-Agent CRM Sandbox endpoint
  app.post("/api/sandbox/run", async (req, res) => {
    try {
      const { payload, customInstructions, autoSanitize = true } = req.body;

      if (!payload) {
        return res.status(400).json({ error: "Payload is required." });
      }

      const {
        firstName = "",
        lastName = "",
        email = "",
        country = "US",
        campaignSubject = "",
        campaignBody = "",
      } = payload;

      const ai = getAiClient();

      // Prepare custom instructions or defaults
      const customSanitization = customInstructions?.sanitization || "";
      const customCompliance = customInstructions?.compliance || "";
      const customAccessibility = customInstructions?.accessibility || "";
      const customCompiler = customInstructions?.compiler || "";

      const systemInstruction = `You are an Interactive Global Multi-Agent CRM Sandbox. Your job is to dynamically research and enforce regional compliance, accessibility, and data hygiene based on the target market.

You operate as a multi-stage workflow with 4 key expert agent-nodes:

1. 🧹 [DATA SANITIZATION NODE]:
   - Inspect name fields for capitalization bugs, numbers, extra characters (e.g. "jEAN-pIERRE", "claire.debadts", "M. S.").
   - Clean and repair the name. If name is a set of initials, missing, or corrupted, generate a culturally appropriate localized greeting.
   - CRITICAL: If the parameter 'Auto-Sanitize Names' is DISABLED in the configuration, do NOT clean, repair, or capitalize the name fields. Bypassing means you must output the raw, uncorrected original name fields exactly as input inside 'repairedName'.
   - Culturally appropriate fallback greetings are critical! For example:
     - Germany (DE): "Sehr geehrte Damen und Herren" or "Sehr geehrte/r Frau/Herr..."
     - France (FR): "Chère cliente, Cher client" or "Madame, Monsieur"
     - Italy (IT): "Gentile Cliente"
     - Japan (JP): Use respectful honorifics like "様 (Sama)" or appropriate Japanese business salutation.
     - US / UK: "Dear Valued Customer" or "Dear Customer".

2. ⚖️ [GLOBAL REGULATORY ANALYST]:
   - Identify target market based on country code (e.g. "FR" -> France, "DE" -> Germany, "US-CA" -> California (US), "IT" -> Italy, "JP" -> Japan, "GB" -> United Kingdom, etc.).
   - Research and explicitly name the 2026 local regulatory frameworks (e.g., CNIL for France, Garante for Italy, CCPA/CPRA for California, UWG/GDPR for Germany, APPI for Japan, PECR/GDPR for UK).
   - Enforce their specific rules on pixel tracking (silent web beacons are illegal under CNIL/Garante; must be flagged and removed or request explicit opt-in), marketing consent (DE/FR require double-opt-in, US-CA requires explicit do-not-sell consumer disclosures), and mandatory footer layouts (e.g., physical sender address, unsubscription link, "Do Not Sell" link for California, "Impressum" with corporate registration details for Germany).

3. ♿ [ACCESSIBILITY AUDITOR]:
   - Enforce EAA (European Accessibility Act) and international WCAG 2.1 AA standards for email.
   - Enforce language tag declaration (e.g., lang="de" in outer tag) so screen readers use correct pronunciation.
   - Color contrast: Text must have high contrast (at least 4.5:1 ratio). Ensure styled blocks use deep charcoal/black text on white, cream, or light pastel backgrounds. Avoid low-contrast gray-on-gray.
   - Ensure CTA (Call to Action) link texts are highly descriptive (e.g., change "Click here" or "Click here to download" to a meaningful phrase like "Download the Q3 compliance guide" or "Register for the compliance seminar").

4. 📬 [HTML COMPILER]:
   - Compile the final, ready-to-ship, inline-styled HTML email that implements ALL the corrections, compliant additions, and accessible code structure.
   - The HTML MUST be elegantly styled using inline styles only (style="..." on tags) to work across Gmail, Outlook, Apple Mail, etc. No external css, no <style> blocks.
   - Make it look stunning, professional, and visually premium: clean margins, neat typography, high-contrast CTA buttons, proper padding, and a gorgeous compliant footer.

Your final output must be in JSON format matching the schema provided, and MUST also include the raw reasoning text formatted under these exact Markdown sections:

1. 🧹 [DATA SANITIZATION NODE] -> Explain name repairs, casing fixes, and selected fallback greeting.
2. ⚖️ [GLOBAL REGULATORY ANALYST] -> Detail country target, active 2026 frameworks (like CNIL, UWG, CCPA), tracking pixel rules applied, opt-in/opt-out criteria, and mandatory footer requirements.
3. ♿ [ACCESSIBILITY AUDITOR] -> Detail EAA/WCAG 2.1 AA rules, lang tags, contrast checks, and specifically show before/after CTA text transformations.
4. 📬 [HTML COMPILER] -> Description of design choices, inline-styling applied, and the beautiful compiled HTML email.

Ensure your JSON response adheres precisely to the provided schema.`;

      const prompt = `Perform the CRM sandbox run with this customer payload:
---
First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Target Country Code: ${country}
Campaign Draft Subject: ${campaignSubject}
Campaign Draft Body: ${campaignBody}
---

Additional Agent Configurations:
- Auto-Sanitize Names: ${autoSanitize ? "ENABLED (Clean casing, remove numbers/special characters, standard title casing)" : "DISABLED (Do NOT correct or sanitize names, bypass all casing repairs, output raw original name fields exactly as input inside 'repairedName')"}
- Sanitization Custom Rules: ${customSanitization || "None"}
- Compliance Custom Rules: ${customCompliance || "None"}
- Accessibility Custom Rules: ${customAccessibility || "None"}
- Compiler Custom Rules: ${customCompiler || "None"}

Please execute all 4 agents in sequence and output the results. Generate a high-contrast, premium HTML email. Keep the design extremely clean, standard, and highly readable. Ensure all details are realistic for 2026.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sanitizationNode: {
                type: Type.OBJECT,
                properties: {
                  reasoning: { type: Type.STRING, description: "Detailed 1. 🧹 [DATA SANITIZATION NODE] reasoning" },
                  originalName: { type: Type.STRING },
                  repairedName: { type: Type.STRING },
                  greetingFallbackUsed: { type: Type.STRING },
                  changedFields: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["reasoning", "repairedName", "greetingFallbackUsed"]
              },
              regulatoryAnalystNode: {
                type: Type.OBJECT,
                properties: {
                  reasoning: { type: Type.STRING, description: "Detailed 2. ⚖️ [GLOBAL REGULATORY ANALYST] reasoning" },
                  targetMarketName: { type: Type.STRING },
                  frameworks2026: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  trackingPixelAction: { type: Type.STRING },
                  consentRequirements: { type: Type.STRING },
                  footerAdditions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["reasoning", "targetMarketName", "frameworks2026", "trackingPixelAction", "consentRequirements"]
              },
              accessibilityAuditorNode: {
                type: Type.OBJECT,
                properties: {
                  reasoning: { type: Type.STRING, description: "Detailed 3. ♿ [ACCESSIBILITY AUDITOR] reasoning" },
                  langTagApplied: { type: Type.STRING },
                  contrastRating: { type: Type.STRING },
                  ctaTransformations: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        before: { type: Type.STRING },
                        after: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      },
                      required: ["before", "after"]
                    }
                  }
                },
                required: ["reasoning", "langTagApplied", "contrastRating", "ctaTransformations"]
              },
              htmlCompilerNode: {
                type: Type.OBJECT,
                properties: {
                  reasoning: { type: Type.STRING, description: "Detailed 4. 📬 [HTML COMPILER] reasoning" },
                  compiledHtml: { type: Type.STRING, description: "Raw ready-to-ship inline-styled HTML email" },
                  visualHighlights: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["reasoning", "compiledHtml"]
              },
              rawMarkdownReasoning: {
                type: Type.STRING,
                description: "A single complete Markdown string displaying the agent's work separated under the EXACT requested Markdown section headers (1. 🧹 [DATA SANITIZATION NODE] ..., 2. ⚖️ [GLOBAL REGULATORY ANALYST] ..., 3. ♿ [ACCESSIBILITY AUDITOR] ..., 4. 📬 [HTML COMPILER] ...)"
              },
              scorecard: {
                type: Type.OBJECT,
                properties: {
                  initialComplianceScore: { type: Type.NUMBER },
                  finalComplianceScore: { type: Type.NUMBER },
                  issuesFixed: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  accessibilityPass: { type: Type.BOOLEAN }
                },
                required: ["initialComplianceScore", "finalComplianceScore", "issuesFixed", "accessibilityPass"]
              }
            },
            required: [
              "sanitizationNode",
              "regulatoryAnalystNode",
              "accessibilityAuditorNode",
              "htmlCompilerNode",
              "rawMarkdownReasoning",
              "scorecard"
            ]
          }
        }
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("Empty response received from Gemini.");
      }

      const data = JSON.parse(resultText);
      res.json(data);
    } catch (error: any) {
      console.error("Error in sandbox run:", error);
      res.status(500).json({ error: error.message || "An error occurred during multi-agent simulation." });
    }
  });

  // Serve frontend assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Global CRM Sandbox Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
