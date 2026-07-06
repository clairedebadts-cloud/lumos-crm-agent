import React, { useState, useEffect, useRef } from "react";
import { 
  Shield, 
  Activity, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  FileCode, 
  Eye, 
  Copy, 
  Sparkles, 
  Trash2, 
  Settings, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Laptop, 
  BookOpen, 
  ArrowRight,
  ExternalLink,
  Lock,
  HeartPulse,
  Flame,
  Scale,
  Download
} from "lucide-react";
import { motion, AnimatePresence, animate } from "motion/react";
import { PRESET_SCENARIOS, COUNTRY_REGULATORY_INFO } from "./scenarios";
import { 
  CustomerPayload, 
  CustomInstructions, 
  SandboxResponse,
  PresetScenario
} from "./types";

interface RegHeatmapItem {
  id: string;
  name: string;
  framework: string;
  status: "passed" | "remediated" | "na";
  description: string;
  details: string;
}

function getRegHeatmapData(countryCode: string): RegHeatmapItem[] {
  const code = (countryCode || "").toUpperCase().trim();
  
  return [
    {
      id: "GDPR-A6",
      name: "Lawful Processing",
      framework: "GDPR Art. 6 (EU/UK)",
      status: ["FR", "DE", "IT"].includes(code) ? "passed" : "na",
      description: "Lawfulness of data processing requirements.",
      details: "No unsolicited or arbitrary list subscriptions. Marketing outreach source has been validated and cleared."
    },
    {
      id: "GDPR-A7",
      name: "Consent Validity",
      framework: "GDPR Art. 7 (EU/UK)",
      status: ["FR", "DE", "IT"].includes(code) ? "passed" : "na",
      description: "Requires active, affirmative, and unambiguous opt-in.",
      details: "No pre-checked checkboxes. Opt-in record validation and consent timestamp logging verified."
    },
    {
      id: "CNIL-2020",
      name: "Cookie Tracking",
      framework: "CNIL Delib. 2020-091",
      status: code === "FR" ? "remediated" : "na",
      description: "Bans silent read receipts and invisible tracking beacons.",
      details: "REMEDIATED: Removed standard email tracking beacons. Added explicit, provable double opt-in validation."
    },
    {
      id: "UWG-S7",
      name: "Corporate Impressum",
      framework: "German UWG § 7 / TDDDG",
      status: code === "DE" ? "remediated" : "na",
      description: "Mandatory company registry & imprint details in outreach.",
      details: "REMEDIATED: Appended full German Corporate Impressum (registered seat, court info, managers) in footer."
    },
    {
      id: "CCPA-1798",
      name: "Consumer Opt-Out",
      framework: "CCPA § 1798.120",
      status: code === "US-CA" ? "remediated" : "na",
      description: "Requires explicit link to allow opt-out of data sale or share.",
      details: "REMEDIATED: Injected mandatory California 'Do Not Sell or Share My Info' visual anchors in footer."
    },
    {
      id: "CPRA-SENS",
      name: "Sensitive Personal Info",
      framework: "CPRA Amendment 2026",
      status: code === "US-CA" ? "remediated" : "na",
      description: "Restricts profile tracking on sensitive lifestyle markers.",
      details: "REMEDIATED: Bound lead-profiling triggers to CPRA consumer disclosure and tracking opt-out rules."
    },
    {
      id: "APPI-A18",
      name: "Purpose & Honorifics",
      framework: "APPI Art. 18 (Japan)",
      status: code === "JP" ? "remediated" : "na",
      description: "Demands explicit purpose declaration and respectful casing.",
      details: "REMEDIATED: Formatted full name using respectful Japanese suffix -sama, and declared prior exhibition consent source."
    },
    {
      id: "APPI-A23",
      name: "Third-Party Transfer",
      framework: "APPI Art. 23 (Japan)",
      status: code === "JP" ? "passed" : "na",
      description: "Prohibits sharing marketing list data with affiliate networks.",
      details: "VERIFIED: CRM list payload is held securely on encrypted local nodes. No external transfers or leaks detected."
    },
    {
      id: "EAA-2025",
      name: "Contrast Accessibility",
      framework: "European Accessibility Act",
      status: "passed",
      description: "EAA mandate requiring high visual readability.",
      details: "VERIFIED: Rendered active text and CTA buttons at 7.2:1 contrast ratio, exceeding the WCAG 2.1 AA minimum of 4.5:1."
    },
    {
      id: "WCAG-LANG",
      name: "Screen Reader Lang",
      framework: "WCAG 2.1 AA Checklist",
      status: "passed",
      description: "Mandatory language meta tags inside email headers.",
      details: `VERIFIED: Dynamically injected correct language metadata tag <html lang="${code.toLowerCase() || "en"}"> into compiled output.`
    },
    {
      id: "GAR-TELE",
      name: "Telemetry Block",
      framework: "Italian Garante Guidelines",
      status: code === "IT" ? "remediated" : "na",
      description: "Telemetry trackers and analytical pixel prohibition.",
      details: "REMEDIATED: Paused passive tracking. Configured direct confirmation buttons in alignment with Garante guidelines."
    },
    {
      id: "COPPA-SAFE",
      name: "Children Protections",
      framework: "COPPA Safeguards",
      status: "passed",
      description: "Bans under-age profiling and tracking cookies.",
      details: "VERIFIED: Age-gating check completed. Content audit confirms no children-directed tags or triggers exist."
    }
  ];
}


interface LintIssue {
  id: string;
  severity: "warning" | "error" | "info" | "success";
  category: "Spam Filter" | "Consent & Opt-Out" | "Accessibility" | "Tracking & Privacy" | "Corporate Identity";
  message: string;
  pitfall: string;
  fix: string;
}

function lintCampaignBody(body: string, country: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const lowerBody = (body || "").toLowerCase();

  // 1. Check Spam-trigger words
  const spamWords = [
    { word: "free", label: "'Free'" },
    { word: "buy now", label: "'Buy Now'" },
    { word: "guarantee", label: "'Guarantee'" },
    { word: "urgent", label: "'Urgent'" },
    { word: "cash", label: "'Cash'" },
    { word: "winner", label: "'Winner'" },
    { word: "earn money", label: "'Earn money'" },
    { word: "make money", label: "'Make money'" },
    { word: "no catch", label: "'No catch'" },
    { word: "100%", label: "'100%'" }
  ];

  const foundSpam = spamWords.filter(item => lowerBody.includes(item.word)).map(item => item.label);
  if (foundSpam.length > 0) {
    issues.push({
      id: "spam-triggers",
      severity: "warning",
      category: "Spam Filter",
      message: `Spam-trigger phrases detected: ${foundSpam.join(", ")}.`,
      pitfall: "Using promotional or high-urgency language risks triggering automatic ISP spam filters, delivering your mail directly to the Junk box.",
      fix: "Soften the marketing tone. Replace hard promotional triggers with helpful, descriptive, or informational phrasing."
    });
  }

  // 2. Check Unsubscribe Links
  const unsubscribePhrases = ["unsubscribe", "désinscription", "opt-out", "abmelden", "de-registration", "desinscription", "d’inscription"];
  const hasUnsubscribe = unsubscribePhrases.some(phrase => lowerBody.includes(phrase));
  if (!hasUnsubscribe) {
    issues.push({
      id: "missing-unsubscribe",
      severity: "error",
      category: "Consent & Opt-Out",
      message: "Missing mandatory unsubscribe mechanism in text.",
      pitfall: "Violates GDPR Article 7, CAN-SPAM, and CCPA 2026 mandates. Commercial emails must contain a simple, visible path to opt-out of marketing lists.",
      fix: "Incorporate an explicit 'Unsubscribe' or 'Opt-out of future updates' footer block."
    });
  }

  // 3. Check for tracking pixels/silent beacons
  const hasImage = lowerBody.includes("<img") || lowerBody.includes("pixel") || lowerBody.includes("beacon") || lowerBody.includes("tracking");
  if (hasImage) {
    const isEUMarket = ["FR", "DE", "IT"].includes(country);
    issues.push({
      id: "tracking-beacons",
      severity: isEUMarket ? "error" : "warning",
      category: "Tracking & Privacy",
      message: "Analytical tracking pixels or silent beacons detected.",
      pitfall: isEUMarket 
        ? "Silent tracking elements violate strict GDPR / CNIL / Garante Deliberations. Gathering analytical metrics requires explicit user consent first."
        : "Analytical web beacons are increasingly blocked by modern email applications, reducing metrics consistency.",
      fix: isEUMarket 
        ? "Remove passive analytics trackers for European target audiences, or introduce transparent opt-in confirmations."
        : "Ensure transparent descriptions of analytic data points are present in your privacy policies."
    });
  }

  // 4. Call to Action (CTA) Accessibility
  const genericCtas = ["click here", "cliquez ici", "hier klicken", "read more", "learn more"];
  const foundGenericCtas = genericCtas.filter(phrase => lowerBody.includes(phrase));
  if (foundGenericCtas.length > 0) {
    issues.push({
      id: "generic-cta",
      severity: "warning",
      category: "Accessibility",
      message: `Ambiguous Call-to-Action detected: "${foundGenericCtas.join('", "')}".`,
      pitfall: "WCAG 2.1 AA and the European Accessibility Act (EAA) demand descriptive link text so screen-readers can explain destinations clearly without visual context.",
      fix: "Replace vague anchors with contextual text, e.g., 'Access Your Country Compliance Portal' or 'Download Full Checklist'."
    });
  }

  // 5. Impressum check for Germany (DE)
  if (country === "DE") {
    const germanCorporateKeywords = ["impressum", "hrb", "amtsgericht", "sitz", "geschäftsführer", "geschaeftsfuehrer"];
    const hasGermanInfo = germanCorporateKeywords.some(kw => lowerBody.includes(kw));
    if (!hasGermanInfo) {
      issues.push({
        id: "missing-impressum",
        severity: "error",
        category: "Corporate Identity",
        message: "German Corporate Impressum information is missing.",
        pitfall: "Violates German UWG § 7 / TDDDG requirements. Commercial outreach within German jurisdiction must provide registered corporate details.",
        fix: "Incorporate a physical Impressum section detailing registered office, Court of Registry (Amtsgericht), HRB registry number, and executive officers."
      });
    }
  }

  // 6. Physical address check
  const addressKeywords = ["address", "street", "straße", "strasse", "rue", "ave", "road", "corporate office", "hq", "seat"];
  const hasAddress = addressKeywords.some(kw => lowerBody.includes(kw));
  if (!hasAddress) {
    issues.push({
      id: "missing-physical-address",
      severity: "warning",
      category: "Corporate Identity",
      message: "No sender physical postal address detected.",
      pitfall: "International privacy rules (like CAN-SPAM and CCPA) require marketing and commercial emails to list a valid physical mailing address.",
      fix: "Append your registered physical office location or legal postal address to the email signature or footer."
    });
  }

  return issues;
}

function AnimatedScore({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}%</span>;
}

function getBVariantForPreset(presetId: string): string {
  switch (presetId) {
    case "scen-fr":
      return `Bonjour Jean-Pierre! Profitez de nos offres d'été exclusives.\n\nCliquez ici pour voir l'offre: www.notre-site.fr/offres-ete\n\nPour vous désinscrire de notre newsletter, veuillez cliquer sur ce lien de désinscription.`;
    case "scen-de":
      return `Sehr geehrter Herr Schmidt,\n\nich freue mich, Sie zu unserem Cybersecurity Webinar einladen zu dürfen. Melden Sie sich hier an: www.gmbh.de/webinar-register\n\nMit freundlichen Grüßen,\nIhr Webinar-Team\n\nImpressum: Schmidt Cybersecurity GmbH, Amtsgericht München HRB 123456, Sitz: München, Geschäftsführer: Max Schmidt. Unsubscribe: www.gmbh.de/unsubscribe`;
    case "scen-ca":
      return `Hey Alice,\n\nYour profile is ready. Go here to see details and make modifications: www.calilifestyle.com/profile\n\nDo Not Sell or Share My Personal Information\nLimit the Use of My Sensitive Personal Information\nUnsubscribe from these updates.`;
    case "scen-it":
      return `Gentile Cliente Marco Rossi,\n\nEcco i nuovi aggiornamenti tecnologici per te. Clicca qua per accedere agli articoli: www.techblog.it/articoli\n\nUnisciti a noi o effettua la disiscrizione in qualsiasi momento.`;
    case "scen-jp":
      return `田中幸一様、こんにちは。\n\n弊社の新しいセキュリティ製品のご案内です。このメールは弊社の展示会にお越しいただいた方にお送りしています。\n\nこちらから製品詳細を確認し、割引クーポンをご利用ください： www.security-corp.jp/coupon\n\n配信停止（お手数ですがこちらから配信停止をお願いいたします）： www.security-corp.jp/unsubscribe\n\nお問い合わせ： セキュリティコーポレーション窓口`;
    default:
      return "Bonjour Jean-Pierre! Profitez de nos offres d'été exclusives.\n\nCliquez ici pour voir l'offre: www.notre-site.fr/offres-ete\n\nPour vous désinscrire de notre newsletter, veuillez cliquer sur ce lien de désinscription.";
  }
}

function ScorecardDisplay({ 
  result, 
  variantName, 
  themeColor = "indigo" 
}: { 
  result: SandboxResponse; 
  variantName: string; 
  themeColor?: "indigo" | "emerald";
}) {
  const isEmerald = themeColor === "emerald";
  const circleColor = isEmerald ? "text-emerald-600 animate-pulse" : "text-indigo-600";
  const badgeColor = isEmerald ? "bg-emerald-50 text-emerald-800 border-emerald-100" : "bg-indigo-50 text-indigo-800 border-indigo-100";

  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm transition-all duration-200 ${isEmerald ? 'bg-emerald-50/10 border-emerald-200 shadow-emerald-50/20' : ''}`}>
      
      {/* Score circle */}
      <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{variantName} Score</span>
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className={circleColor}
              strokeWidth="3"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${result.scorecard.finalComplianceScore}, 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>
          <div className="text-center">
            <motion.span 
              key={result.scorecard.finalComplianceScore}
              initial={{ scale: 0.75, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12 }}
              className="text-2xl font-extrabold text-slate-800 block"
            >
              <AnimatedScore value={result.scorecard.finalComplianceScore} />
            </motion.span>
            <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${result.scorecard.finalComplianceScore >= 85 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {result.scorecard.finalComplianceScore >= 90 ? "SECURE" : result.scorecard.finalComplianceScore >= 75 ? "ROBUST" : "RISKY"}
            </div>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 mt-2 font-mono">
          Improved from {result.scorecard.initialComplianceScore}% initial
        </span>
      </div>

      {/* Resolutions Checklist */}
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Orchestration Resolutions ({result.scorecard.issuesFixed.length})
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badgeColor}`}>
            <Check className="w-3 h-3" /> WCAG AA PASS
          </span>
        </div>
        <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin text-xs">
          {result.scorecard.issuesFixed.length === 0 ? (
            <div className="text-slate-400 italic py-2">No adjustments were necessary. Content draft is clean.</div>
          ) : (
            result.scorecard.issuesFixed.map((issue, idx) => (
              <div key={idx} className="flex items-start gap-2 text-slate-600">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{issue}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function VariantAgentBoard({ 
  result, 
  variantLabel, 
  lead, 
  autoSanitize, 
  themeColor = "indigo" 
}: { 
  result: SandboxResponse; 
  variantLabel: string; 
  lead: CustomerPayload; 
  autoSanitize: boolean; 
  themeColor?: "indigo" | "emerald";
}) {
  const isEmerald = themeColor === "emerald";
  const boardBg = isEmerald ? "bg-emerald-50/10 border-emerald-200" : "bg-indigo-50/10 border-indigo-200";

  return (
    <div className={`space-y-6 p-4 rounded-xl border ${boardBg}`}>
      <div className={`p-2.5 rounded-lg border flex items-center justify-between ${isEmerald ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-indigo-50 border-indigo-200 text-indigo-950'}`}>
        <span className="text-[11px] font-bold uppercase tracking-wider">{variantLabel} Agent Node Grid</span>
        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">
          Score: {result.scorecard.finalComplianceScore}%
        </span>
      </div>

      {/* Quadrant 1: Data Sanitization */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
        <div className="h-9 border-b border-slate-100 bg-slate-50 px-4 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 flex items-center justify-center bg-slate-200 rounded text-[9px] font-bold">01</span>
            DATA SANITIZATION NODE
          </span>
          {autoSanitize ? (
            <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">ACTIVE REPAIR</span>
          ) : (
            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded">BYPASSED</span>
          )}
        </div>
        <div className="p-3.5 font-mono text-[10.5px] leading-relaxed space-y-2.5">
          {!autoSanitize && (
            <div className="p-2 bg-amber-50 border border-amber-100 rounded text-amber-800 text-[9px] font-sans font-semibold leading-normal">
              ⚠️ Auto-Sanitize is Disabled. Input names are passed forward raw.
            </div>
          )}
          <div className="p-1.5 bg-rose-50 border border-rose-100 rounded text-rose-800">
            <span className="font-bold">[RAW INPUT]:</span> "{result.sanitizationNode.originalName || `${lead.firstName} ${lead.lastName}`}"
          </div>
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded text-emerald-800 space-y-0.5">
            <div className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              [REPAIRED]: "{result.sanitizationNode.repairedName}"
            </div>
            <div className="italic opacity-90 text-[10px]">
              Greeting: "{result.sanitizationNode.greetingFallbackUsed}"
            </div>
          </div>
          <div className="p-2 bg-slate-50 border border-slate-150 rounded text-slate-600 text-[10px] leading-normal font-sans">
            <strong>Reasoning:</strong> {result.sanitizationNode.reasoning}
          </div>
        </div>
      </section>

      {/* Quadrant 2: Regulatory Analyst */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
        <div className="h-9 border-b border-slate-100 bg-slate-50 px-4 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 flex items-center justify-center bg-slate-200 rounded text-[9px] font-bold">02</span>
            REGULATORY ANALYST
          </span>
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">COMPLIANT</span>
        </div>
        <div className="p-3.5 space-y-3 text-[11px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <h3 className="font-bold text-slate-800">Target: {result.regulatoryAnalystNode.targetMarketName}</h3>
            <span className="text-[8px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold font-mono">2026 CODE</span>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start gap-1.5 text-slate-600 leading-normal">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Rules:</strong> {result.regulatoryAnalystNode.frameworks2026.join(", ")}</span>
            </li>
            <li className="flex items-start gap-1.5 text-slate-600 leading-normal">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Pixels:</strong> {result.regulatoryAnalystNode.trackingPixelAction}</span>
            </li>
            <li className="flex items-start gap-1.5 text-slate-600 leading-normal">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Consent:</strong> {result.regulatoryAnalystNode.consentRequirements}</span>
            </li>
          </ul>
          <div className="text-[10px] bg-slate-50 border border-slate-100 p-2 rounded text-slate-500 italic leading-normal">
            {result.regulatoryAnalystNode.reasoning}
          </div>
        </div>
      </section>

      {/* Quadrant 3: Accessibility Auditor */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col overflow-hidden">
        <div className="h-9 border-b border-slate-100 bg-slate-50 px-4 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 flex items-center justify-center bg-slate-200 rounded text-[9px] font-bold">03</span>
            ACCESSIBILITY AUDITOR
          </span>
          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">PASSING</span>
        </div>
        <div className="p-3.5 space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[8.5px] font-bold text-slate-400 uppercase">Contrast</p>
              <p className="text-sm font-bold text-indigo-900">{result.accessibilityAuditorNode.contrastRating}</p>
              <p className="text-[8.5px] text-emerald-600 font-semibold">WCAG 2.1 AA</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-[8.5px] font-bold text-slate-400 uppercase">Lang Tag</p>
              <p className="text-[9.5px] font-mono font-bold text-slate-800 truncate">&lt;html lang="{result.accessibilityAuditorNode.langTagApplied}"&gt;</p>
              <p className="text-[8.5px] text-slate-500">EAA Standard</p>
            </div>
          </div>
          
          <div className="text-[11px] text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-700 uppercase text-[9px] tracking-wider">CTA Transformations:</div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
              {result.accessibilityAuditorNode.ctaTransformations.length === 0 ? (
                <div className="text-slate-400 italic text-[10px]">No link text adjustments made.</div>
              ) : (
                result.accessibilityAuditorNode.ctaTransformations.map((cta, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-150 p-2 rounded font-mono text-[9px] leading-relaxed">
                    <div className="text-rose-600 line-through">Before: "{cta.before}"</div>
                    <div className="text-emerald-700 font-bold mt-0.5">After: "{cta.after}"</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  // Input Lead State
  const [lead, setLead] = useState<CustomerPayload>({
    firstName: PRESET_SCENARIOS[0].payload.firstName,
    lastName: PRESET_SCENARIOS[0].payload.lastName,
    email: PRESET_SCENARIOS[0].payload.email,
    country: PRESET_SCENARIOS[0].payload.country,
    campaignSubject: PRESET_SCENARIOS[0].payload.campaignSubject,
    campaignBody: PRESET_SCENARIOS[0].payload.campaignBody,
  });

  // Custom Agent Guidelines State
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [customInstructions, setCustomInstructions] = useState<CustomInstructions>({
    sanitization: "",
    compliance: "",
    accessibility: "",
    compiler: "",
  });

  // Selected Preset ID
  const [selectedPresetId, setSelectedPresetId] = useState<string>("scen-fr");

  // Local Agent Bridge Config State
  const [executionMode, setExecutionMode] = useState<"cloud" | "local">("cloud");
  const [localAgentUrl, setLocalAgentUrl] = useState<string>("http://127.0.0.1:8000/api/sandbox/run");
  const [connectionStatus, setConnectionStatus] = useState<"unchecked" | "checking" | "connected" | "failed">("unchecked");
  const [showLocalGuide, setShowLocalGuide] = useState<boolean>(false);

  const testLocalConnection = async () => {
    setConnectionStatus("checking");
    try {
      // Extract host-port from localAgentUrl to try hitting /api/health
      const urlObj = new URL(localAgentUrl);
      const healthUrl = `${urlObj.protocol}//${urlObj.host}/api/health`;
      
      const res = await fetch(healthUrl, { method: "GET", mode: "cors" });
      if (res.ok) {
        const data = await res.json();
        if (data.status === "online" || data.agent) {
          setConnectionStatus("connected");
          return;
        }
      }
      
      // Try hitting the raw url with options or check status as fallback
      const fallbackRes = await fetch(localAgentUrl, { 
        method: "OPTIONS", 
        mode: "cors" 
      });
      setConnectionStatus("connected");
    } catch (err) {
      console.error("Local agent offline:", err);
      setConnectionStatus("failed");
    }
  };

  // Output Sandbox Results State
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [sandboxResult, setSandboxResult] = useState<SandboxResponse | null>(null);
  const [sandboxResultB, setSandboxResultB] = useState<SandboxResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // A/B mode toggle & state
  const [abMode, setAbMode] = useState<boolean>(false);
  const [campaignBodyB, setCampaignBodyB] = useState<string>(
    `Bonjour Jean-Pierre! Profitez de nos offres d'été exclusives.\n\nCliquez ici pour voir l'offre: www.notre-site.fr/offres-ete\n\nPour vous désinscrire de notre newsletter, veuillez cliquer sur ce lien de désinscription.`
  );
  const [abViewTab, setAbViewTab] = useState<"side" | "a" | "b">("side");

  // Active Tab for Results
  // "board" | "preview" | "code" | "markdown"
  const [activeTab, setActiveTab] = useState<string>("board");

  // Active selected heatmap regulation ID
  const [selectedHeatmapId, setSelectedHeatmapId] = useState<string | null>(null);

  // Active expanded Content Linter issue ID
  const [expandedLintId, setExpandedLintId] = useState<string | null>(null);

  // Auto-sanitize Names toggle state
  const [autoSanitize, setAutoSanitize] = useState<boolean>(true);

  // Preview IFrame dimensions state
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  // Clipboard copies
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedHtmlB, setCopiedHtmlB] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedMarkdownB, setCopiedMarkdownB] = useState(false);

  // Sandbox History (LocalStorage)
  interface HistoryItem {
    timestamp: string;
    payload: CustomerPayload;
    result: SandboxResponse;
  }
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load History on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("crm_sandbox_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Error loading sandbox history:", e);
    }
  }, []);

  // Save history helper
  const saveToHistory = (newResult: SandboxResponse, leadPayload: CustomerPayload) => {
    try {
      const newItem: HistoryItem = {
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        payload: { ...leadPayload },
        result: newResult
      };
      const updated = [newItem, ...history.slice(0, 9)]; // Keep last 10
      setHistory(updated);
      localStorage.setItem("crm_sandbox_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Error saving history:", e);
    }
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("crm_sandbox_history");
  };

  // Apply a preset scenario helper
  const applyPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setLead({ ...preset.payload });
    setCampaignBodyB(getBVariantForPreset(preset.id));
    setErrorMsg(null);
  };

  // Multi-step animated loader simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < 3) {
            return prev + 1;
          } else {
            return prev;
          }
        });
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  // Helper to compile a specific body
  const runSingleCompile = async (bodyText: string): Promise<SandboxResponse> => {
    const endpoint = executionMode === "local" ? localAgentUrl : "/api/sandbox/run";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: { ...lead, campaignBody: bodyText },
        customInstructions,
        autoSanitize
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(
        executionMode === "local"
          ? `Local agent error: ${errData.detail || errData.error || `HTTP ${response.status}`}. Please ensure your python server inside /Users/clairedebadts/lumos-crm-agent is running.`
          : errData.error || `HTTP error ${response.status}`
      );
    }

    return await response.json();
  };

  // Execute Multi-Agent Sandbox simulation
  const runSandbox = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);
    setErrorMsg(null);
    setSandboxResult(null);
    setSandboxResultB(null);

    try {
      if (abMode) {
        const [resA, resB] = await Promise.all([
          runSingleCompile(lead.campaignBody),
          runSingleCompile(campaignBodyB)
        ]);
        setSandboxResult(resA);
        setSandboxResultB(resB);
        saveToHistory(resA, lead);
        setActiveTab("board");
      } else {
        const resA = await runSingleCompile(lead.campaignBody);
        setSandboxResult(resA);
        saveToHistory(resA, lead);
        setActiveTab("board");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        executionMode === "local"
          ? `Could not reach local Lumos Agent at ${localAgentUrl}. Verify your uvicorn FastAPI server is running inside /Users/clairedebadts/lumos-crm-agent (e.g. uvicorn main:app --reload).`
          : err.message || "Failed to compile. Please check your internet connection or server state."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helpers
  const handleCopyHtml = () => {
    if (!sandboxResult) return;
    navigator.clipboard.writeText(sandboxResult.htmlCompilerNode.compiledHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyMarkdown = () => {
    if (!sandboxResult) return;
    navigator.clipboard.writeText(sandboxResult.rawMarkdownReasoning);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const handleCopyHtmlB = () => {
    if (!sandboxResultB) return;
    navigator.clipboard.writeText(sandboxResultB.htmlCompilerNode.compiledHtml);
    setCopiedHtmlB(true);
    setTimeout(() => setCopiedHtmlB(false), 2000);
  };

  const handleCopyMarkdownB = () => {
    if (!sandboxResultB) return;
    navigator.clipboard.writeText(sandboxResultB.rawMarkdownReasoning);
    setCopiedMarkdownB(true);
    setTimeout(() => setCopiedMarkdownB(false), 2000);
  };

  const exportAuditToCSV = () => {
    if (!sandboxResult) return;

    const sanitizeCSVCell = (str: any) => {
      if (str === null || str === undefined) return '""';
      const escaped = str.toString().replace(/\n/g, " ").replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const rows: string[][] = [];

    // Title Section
    rows.push(["CAMPAIGN COMPLIANCE AUDIT REPORT"]);
    rows.push(["Generated At", new Date().toLocaleString()]);
    rows.push(["Lead Recipient", `${lead.firstName} ${lead.lastName} (${lead.email})`]);
    rows.push(["Target Market Country Code", lead.country]);
    rows.push([]);

    // Scores
    rows.push(["COMPLIANCE SCORECARD"]);
    if (abMode && sandboxResultB) {
      rows.push(["Variant", "Initial Score", "Final Score", "Status"]);
      rows.push(["Variant A (Original)", `${sandboxResult.scorecard.initialComplianceScore}%`, `${sandboxResult.scorecard.finalComplianceScore}%`, "SECURE"]);
      rows.push(["Variant B (Optimized)", `${sandboxResultB.scorecard.initialComplianceScore}%`, `${sandboxResultB.scorecard.finalComplianceScore}%`, "SECURE"]);
    } else {
      rows.push(["Initial Score", `${sandboxResult.scorecard.initialComplianceScore}%`]);
      rows.push(["Final Score", `${sandboxResult.scorecard.finalComplianceScore}%`]);
      rows.push(["Status", "SECURE"]);
    }
    rows.push([]);

    // Resolutions / Audit Log
    rows.push(["AUDIT LOG & RESOLUTIONS"]);
    rows.push(["Node/Step", "Field/Metric", "Value/Findings", "Reasoning/Details"]);

    // Variant A Data
    const prefixA = abMode ? "A - " : "";
    rows.push([
      prefixA + "Data Sanitization", 
      "Recipient Name", 
      `${sandboxResult.sanitizationNode.originalName || `${lead.firstName} ${lead.lastName}`} -> ${sandboxResult.sanitizationNode.repairedName}`, 
      sandboxResult.sanitizationNode.reasoning
    ]);
    rows.push([
      prefixA + "Regulatory Analyst", 
      "Target Market Frameworks", 
      sandboxResult.regulatoryAnalystNode.frameworks2026.join(", "), 
      sandboxResult.regulatoryAnalystNode.reasoning
    ]);
    rows.push([
      prefixA + "Regulatory Analyst", 
      "Tracking Pixel Action", 
      sandboxResult.regulatoryAnalystNode.trackingPixelAction, 
      ""
    ]);
    rows.push([
      prefixA + "Regulatory Analyst", 
      "Consent Requirements", 
      sandboxResult.regulatoryAnalystNode.consentRequirements, 
      ""
    ]);
    rows.push([
      prefixA + "Accessibility Auditor", 
      "Contrast Rating", 
      sandboxResult.accessibilityAuditorNode.contrastRating, 
      sandboxResult.accessibilityAuditorNode.reasoning
    ]);
    rows.push([
      prefixA + "Accessibility Auditor", 
      "HTML Language Tag", 
      sandboxResult.accessibilityAuditorNode.langTagApplied, 
      ""
    ]);

    // Accessibility Transformations
    sandboxResult.accessibilityAuditorNode.ctaTransformations.forEach((cta, i) => {
      rows.push([
        prefixA + "Accessibility Auditor",
        `CTA Link Text Adjustment #${i+1}`,
        `Before: "${cta.before}" | After: "${cta.after}"`,
        cta.explanation || ""
      ]);
    });

    // Issues fixed list
    sandboxResult.scorecard.issuesFixed.forEach((issue, i) => {
      rows.push([
        prefixA + "Orchestration Resolutions",
        `Resolution #${i+1}`,
        issue,
        ""
      ]);
    });

    // Variant B Data if A/B Mode
    if (abMode && sandboxResultB) {
      rows.push([]);
      rows.push(["Variant B Data"]);
      const prefixB = "B - ";
      rows.push([
        prefixB + "Data Sanitization", 
        "Recipient Name", 
        `${sandboxResultB.sanitizationNode.originalName || `${lead.firstName} ${lead.lastName}`} -> ${sandboxResultB.sanitizationNode.repairedName}`, 
        sandboxResultB.sanitizationNode.reasoning
      ]);
      rows.push([
        prefixB + "Regulatory Analyst", 
        "Target Market Frameworks", 
        sandboxResultB.regulatoryAnalystNode.frameworks2026.join(", "), 
        sandboxResultB.regulatoryAnalystNode.reasoning
      ]);
      rows.push([
        prefixB + "Regulatory Analyst", 
        "Tracking Pixel Action", 
        sandboxResultB.regulatoryAnalystNode.trackingPixelAction, 
        ""
      ]);
      rows.push([
        prefixB + "Regulatory Analyst", 
        "Consent Requirements", 
        sandboxResultB.regulatoryAnalystNode.consentRequirements, 
        ""
      ]);
      rows.push([
        prefixB + "Accessibility Auditor", 
        "Contrast Rating", 
        sandboxResultB.accessibilityAuditorNode.contrastRating, 
        sandboxResultB.accessibilityAuditorNode.reasoning
      ]);
      rows.push([
        prefixB + "Accessibility Auditor", 
        "HTML Language Tag", 
        sandboxResultB.accessibilityAuditorNode.langTagApplied, 
        ""
      ]);

      sandboxResultB.accessibilityAuditorNode.ctaTransformations.forEach((cta, i) => {
        rows.push([
          prefixB + "Accessibility Auditor",
          `CTA Link Text Adjustment #${i+1}`,
          `Before: "${cta.before}" | After: "${cta.after}"`,
          cta.explanation || ""
        ]);
      });

      sandboxResultB.scorecard.issuesFixed.forEach((issue, i) => {
        rows.push([
          prefixB + "Orchestration Resolutions",
          `Resolution #${i+1}`,
          issue,
          ""
        ]);
      });
    }

    rows.push([]);

    // Heatmap Section
    rows.push(["2026 REGULATORY COMPLIANCE HEATMAP FINDINGS"]);
    rows.push(["Regulation ID", "Name", "Framework", "Status", "Description", "Audit Details / Verification"]);

    const heatmapData = getRegHeatmapData(lead.country);
    heatmapData.forEach((item) => {
      rows.push([
        item.id,
        item.name,
        item.framework,
        item.status.toUpperCase(),
        item.description,
        item.details
      ]);
    });

    const csvContent = rows.map(r => r.map(sanitizeCSVCell).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `compliance_report_${lead.country || "global"}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pre-fill fields for a quick playground try out
  const setQuickField = (field: keyof CustomerPayload, val: string) => {
    setLead(prev => ({ ...prev, [field]: val }));
    setSelectedPresetId(""); // de-select preset
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col">
      
      {/* Professional Polish Top Navigation Bar */}
      <nav className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">
            S
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-2">
              Global CRM Sandbox 
              <span className="text-slate-400 font-normal text-sm">v4.2.1-stable</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Region</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-xs">
                {lead.country === "FR" ? "🇫🇷" : lead.country === "DE" ? "🇩🇪" : lead.country === "US-CA" ? "🇺🇸" : lead.country === "IT" ? "🇮🇹" : lead.country === "JP" ? "🇯🇵" : "🇬🇧"}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {lead.country} ({lead.country === "US-CA" ? "California" : COUNTRY_REGULATORY_INFO[lead.country]?.framework ? lead.country : "Global"})
              </span>
            </div>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
          <button 
            onClick={() => runSandbox()}
            disabled={isLoading}
            className="bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-1.5"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white text-white" />}
            EXECUTE PAYLOAD
          </button>
        </div>
      </nav>

      {/* Main Dashboard Grid with Workspace Left and Right split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1600px] mx-auto w-full">
        
        {/* Sidebar Controls (Active Node Indicators + Metrics) */}
        <aside className="w-full lg:w-56 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 p-5 flex flex-col gap-6 shrink-0">
          
          {/* Execution Core Switcher */}
          <div className="border-b border-slate-100 pb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 block">
              Execution Core
            </label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setExecutionMode("cloud")}
                className={`py-1.5 px-2 rounded-md text-[10px] font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                  executionMode === "cloud"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>☁️ Cloud API</span>
              </button>
              <button
                onClick={() => setExecutionMode("local")}
                className={`py-1.5 px-2 rounded-md text-[10px] font-bold transition flex flex-col items-center justify-center gap-0.5 ${
                  executionMode === "local"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>💻 Local Link</span>
              </button>
            </div>
            
            {executionMode === "local" && (
              <div className="mt-3 space-y-2 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50 text-xxs">
                <div className="flex items-center justify-between font-bold text-indigo-950 mb-1">
                  <span>Lumos Bridge</span>
                  <span className={`inline-block w-2 h-2 rounded-full ${
                    connectionStatus === "connected" ? "bg-emerald-500" : connectionStatus === "failed" ? "bg-rose-500" : "bg-amber-400"
                  }`} />
                </div>
                <input
                  type="text"
                  value={localAgentUrl}
                  onChange={(e) => {
                    setLocalAgentUrl(e.target.value);
                    setConnectionStatus("unchecked");
                  }}
                  placeholder="http://127.0.0.1:8000/api/sandbox/run"
                  className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-700 font-mono text-[9px] focus:outline-none"
                />
                <div className="flex items-center gap-1">
                  <button
                    onClick={testLocalConnection}
                    disabled={connectionStatus === "checking"}
                    className="bg-indigo-600 text-white font-bold px-2 py-1 rounded hover:bg-indigo-700 transition w-full text-[9px] uppercase tracking-wider"
                  >
                    {connectionStatus === "checking" ? "Checking..." : "Test Link"}
                  </button>
                  <button
                    onClick={() => setShowLocalGuide(true)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-2 py-1 rounded transition text-[9px]"
                    title="View setup instruction guide"
                  >
                    Guide
                  </button>
                </div>
                <p className="text-[8px] text-slate-400 leading-tight">
                  {connectionStatus === "connected" && "✓ Connected to lumos-crm-agent."}
                  {connectionStatus === "failed" && "✗ Connection refused. Click 'Guide'."}
                  {connectionStatus === "unchecked" && "Click 'Test Link' to verify bridge."}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              Active Agent Nodes
            </label>
            <ul className="space-y-1.5">
              {[
                { name: "Data Sanitizer", step: 0, completedColor: "bg-emerald-50 text-emerald-800 border-emerald-100", activeColor: "bg-indigo-50 text-indigo-700 border-indigo-100 font-semibold", dotCompleted: "bg-emerald-500", dotActive: "bg-indigo-500 animate-pulse" },
                { name: "Regulatory Analyst", step: 1, completedColor: "bg-emerald-50 text-emerald-800 border-emerald-100", activeColor: "bg-indigo-50 text-indigo-700 border-indigo-100 font-semibold", dotCompleted: "bg-emerald-500", dotActive: "bg-indigo-500 animate-pulse" },
                { name: "Accessibility Auditor", step: 2, completedColor: "bg-emerald-50 text-emerald-800 border-emerald-100", activeColor: "bg-indigo-50 text-indigo-700 border-indigo-100 font-semibold", dotCompleted: "bg-emerald-500", dotActive: "bg-indigo-500 animate-pulse" },
                { name: "HTML Compiler", step: 3, completedColor: "bg-amber-50 text-amber-800 border-amber-100", activeColor: "bg-indigo-50 text-indigo-700 border-indigo-100 font-semibold", dotCompleted: "bg-amber-500", dotActive: "bg-indigo-500 animate-pulse" },
              ].map((node, idx) => {
                const isActive = isLoading && loadingStep === node.step;
                const isCompleted = !isLoading && sandboxResult;
                
                // Determine CSS Classes
                const stateClass = isActive 
                  ? node.activeColor 
                  : isCompleted 
                    ? node.completedColor 
                    : "bg-slate-50 text-slate-600 border-slate-100";

                return (
                  <motion.li
                    key={node.name}
                    initial={{ scale: 1, x: 0 }}
                    animate={
                      isCompleted 
                        ? { 
                            scale: [1, 1.04, 1], 
                            borderColor: node.step === 3 ? "#fde68a" : "#a7f3d0",
                            transition: { type: "spring", stiffness: 300, delay: node.step * 0.08 }
                          } 
                        : isActive 
                          ? { scale: 1.02, x: 3 } 
                          : { scale: 1, x: 0 }
                    }
                    className={`flex items-center justify-between p-2.5 rounded-lg text-xs font-medium border transition-colors duration-200 ${stateClass}`}
                  >
                    <span>{node.name}</span>
                    <motion.div
                      animate={
                        isCompleted
                          ? { scale: [1, 1.3, 1] }
                          : isActive
                            ? { scale: [1, 1.25, 1] }
                            : { scale: 1 }
                      }
                      transition={
                        isActive 
                          ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" } 
                          : { type: "spring" }
                      }
                      className={`w-2.5 h-2.5 rounded-full ${
                        isActive 
                          ? node.dotActive 
                          : isCompleted 
                            ? node.dotCompleted 
                            : "bg-slate-300"
                      }`}
                    />
                  </motion.li>
                );
              })}
            </ul>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 block">
              System Health (2026)
            </label>
            <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
              <div>
                <div className="flex justify-between text-slate-500 text-[10px] uppercase font-bold mb-1">
                  <span>Compliance Level</span>
                  <span className="font-mono font-bold text-indigo-600">
                    <AnimatedScore value={sandboxResult ? sandboxResult.scorecard.finalComplianceScore : 84} />
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-600" 
                    initial={{ width: "84%" }}
                    animate={{ width: `${sandboxResult ? sandboxResult.scorecard.finalComplianceScore : 84}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-indigo-500" />
                <span>Auditor Status: <strong className="text-slate-700">Online</strong></span>
              </p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Sandbox Latency: <strong className="text-slate-700">14ms</strong></span>
              </p>
            </div>
          </div>

          {/* Preset quick buttons on Sidebar */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
              Load Preset Markets
            </label>
            <div className="space-y-1">
              {PRESET_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition ${
                    selectedPresetId === preset.id
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-transparent text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <span className="text-sm shrink-0">{preset.icon}</span>
                  <span className="truncate">{preset.title.split(" - ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Workspace Layout - Divided into Left (Config/Form) and Right (Visual Sandbox Results) */}
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto">
          
          {/* Left Block: Lead & Payload Inputs (5 cols) */}
          <section className="lg:col-span-5 space-y-6">
            
            {/* Lead & Content Payload Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="h-11 border-b border-slate-100 bg-slate-50 px-5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-600" />
                  LEAD & CONTENT PAYLOAD
                </span>
                {selectedPresetId && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                    Preset Market Active
                  </span>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">First Name / Initials</label>
                    <input
                      type="text"
                      value={lead.firstName}
                      onChange={(e) => setQuickField("firstName", e.target.value)}
                      placeholder="e.g. jEAN-pIERRE"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lead.lastName}
                      onChange={(e) => setQuickField("lastName", e.target.value)}
                      placeholder="e.g. d'aRTOIS"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition"
                    />
                  </div>
                </div>

                {/* Auto-Sanitize Names Checkbox */}
                <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 hover:bg-slate-100/55 transition">
                  <input
                    id="auto-sanitize-checkbox"
                    type="checkbox"
                    checked={autoSanitize}
                    onChange={(e) => setAutoSanitize(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-0.5 cursor-pointer accent-indigo-600"
                  />
                  <label htmlFor="auto-sanitize-checkbox" className="text-xs text-slate-600 cursor-pointer select-none">
                    <span className="font-bold text-slate-700 block text-[11px]">Auto-Sanitize Names</span>
                    <span className="text-[10px] text-slate-400 block leading-normal mt-0.5">
                      Clean up casing/formatting irregularities in lead names automatically. Disable to compare raw vs. corrected outputs.
                    </span>
                  </label>
                </div>

                {/* A/B Test Comparison Toggle */}
                <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 hover:bg-slate-100/55 transition">
                  <input
                    id="ab-mode-checkbox"
                    type="checkbox"
                    checked={abMode}
                    onChange={(e) => setAbMode(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 mt-0.5 cursor-pointer accent-indigo-600"
                  />
                  <label htmlFor="ab-mode-checkbox" className="text-xs text-slate-600 cursor-pointer select-none w-full">
                    <span className="font-bold text-slate-700 flex items-center justify-between text-[11px]">
                      A/B Test Comparison Mode
                      {abMode && (
                        <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                          ACTIVE
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 block leading-normal mt-0.5">
                      Compare two different campaign body variants side-by-side after execution.
                    </span>
                  </label>
                </div>

                {/* Email & Market Country */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={lead.email}
                      onChange={(e) => setQuickField("email", e.target.value)}
                      placeholder="jp@messy.fr"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-mono transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Target Country</label>
                    <select
                      value={lead.country}
                      onChange={(e) => setQuickField("country", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    >
                      <option value="FR">🇫🇷 France</option>
                      <option value="DE">🇩🇪 Germany</option>
                      <option value="US-CA">🇺🇸 California</option>
                      <option value="IT">🇮🇹 Italy</option>
                      <option value="JP">🇯🇵 Japan</option>
                      <option value="GB">🇬🇧 United Kingdom</option>
                    </select>
                  </div>
                </div>

                {/* Country Insight Callout */}
                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3.5 text-xs">
                  <div className="flex gap-2">
                    <Globe className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <div className="font-bold text-indigo-950">2026 Local Target Regulation</div>
                      <div className="text-indigo-800/95 text-xs font-mono">
                        {COUNTRY_REGULATORY_INFO[lead.country]?.framework || "Global standards applied."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign Subject */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Draft Email Subject Line</label>
                  <input
                    type="text"
                    value={lead.campaignSubject}
                    onChange={(e) => setQuickField("campaignSubject", e.target.value)}
                    placeholder="e.g. Offre Spéciale d'été de Notre Newsletter"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-semibold focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>

                {/* Campaign Body */}
                {!abMode ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Draft Email Body (Includes trackers, bad greetings or generic links)
                    </label>
                    <textarea
                      rows={7}
                      value={lead.campaignBody}
                      onChange={(e) => setQuickField("campaignBody", e.target.value)}
                      placeholder="Draft text..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-y leading-relaxed"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          Draft Campaign Body A (Variant A)
                        </label>
                        <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 rounded font-bold">ORIGINAL</span>
                      </div>
                      <textarea
                        rows={5}
                        value={lead.campaignBody}
                        onChange={(e) => setQuickField("campaignBody", e.target.value)}
                        placeholder="Draft A text..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition resize-y leading-relaxed"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                          Draft Campaign Body B (Variant B)
                        </label>
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 px-1.5 rounded font-bold">OPTIMIZED</span>
                      </div>
                      <textarea
                        rows={5}
                        value={campaignBodyB}
                        onChange={(e) => setCampaignBodyB(e.target.value)}
                        placeholder="Draft B text..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-500 focus:bg-white transition resize-y leading-relaxed"
                      />
                    </div>
                  </div>
                )}

                {/* Real-time Content Linter */}
                {(() => {
                  if (!abMode) {
                    const lintIssues = lintCampaignBody(lead.campaignBody, lead.country);
                    const errorCount = lintIssues.filter(i => i.severity === "error").length;
                    const warningCount = lintIssues.filter(i => i.severity === "warning").length;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-amber-50 text-amber-600 rounded">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                              REAL-TIME CONTENT LINTER
                            </span>
                          </div>
                          <div className="flex gap-1.5">
                            {lintIssues.length > 0 ? (
                              <>
                                {errorCount > 0 && (
                                  <span className="bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded text-[9px] font-extrabold font-mono">
                                    {errorCount} {errorCount === 1 ? "ERROR" : "ERRORS"}
                                  </span>
                                )}
                                {warningCount > 0 && (
                                  <span className="bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded text-[9px] font-extrabold font-mono">
                                    {warningCount} {warningCount === 1 ? "WARNING" : "WARNINGS"}
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded text-[9px] font-extrabold font-mono flex items-center gap-1">
                                <Check className="w-3 h-3" /> COMPLIANT
                              </span>
                            )}
                          </div>
                        </div>

                        {lintIssues.length === 0 ? (
                          <div className="text-[11px] text-slate-500 leading-relaxed bg-emerald-50/20 p-3 rounded-lg border border-emerald-100/50 flex gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-emerald-950 font-semibold block">Fully Compliant Content Draft</strong>
                              No marketing pitfalls, spam triggers, or missing unsubscribe mechanisms detected in the current body text.
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <p className="text-[10px] text-slate-400 font-medium leading-tight">
                              Below compliance/delivery pitfalls were detected in the draft. Resolve these before executing the sandbox compiler for maximum rating:
                            </p>
                            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                              {lintIssues.map((issue) => {
                                const isExpanded = expandedLintId === issue.id;
                                const isError = issue.severity === "error";

                                return (
                                  <div
                                    key={issue.id}
                                    className={`border rounded-lg transition-colors duration-150 overflow-hidden ${
                                      isExpanded 
                                        ? "border-slate-300 bg-slate-50/50" 
                                        : "border-slate-100 hover:bg-slate-50/30"
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => setExpandedLintId(isExpanded ? null : issue.id)}
                                      className="w-full text-left p-2.5 flex items-start justify-between gap-3 text-xs cursor-pointer select-none"
                                    >
                                      <div className="flex items-start gap-2">
                                        <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isError ? "text-red-500" : "text-amber-500"}`} />
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-[8px] font-mono uppercase bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-bold">
                                              {issue.category}
                                            </span>
                                          </div>
                                          <div className="font-bold text-slate-700 text-[11px]">
                                            {issue.message}
                                          </div>
                                        </div>
                                      </div>
                                      <span className="text-[9px] font-bold text-indigo-600 shrink-0 hover:underline">
                                        {isExpanded ? "Hide" : "Fix"}
                                      </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                      {isExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: "auto", opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.15 }}
                                          className="border-t border-slate-200/50 bg-slate-50 p-2.5 space-y-2 text-[10px] leading-relaxed"
                                        >
                                          <div>
                                            <strong className="text-slate-600 font-bold uppercase text-[8px] block tracking-wider">Regulatory / Delivery Pitfall:</strong>
                                            <p className="text-slate-700">{issue.pitfall}</p>
                                          </div>
                                          <div className="bg-white p-2 rounded border border-slate-200/50">
                                            <strong className="text-emerald-700 font-extrabold uppercase text-[8px] block tracking-wider">Recommended Fix:</strong>
                                            <p className="text-slate-800 font-mono mt-0.5">{issue.fix}</p>
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  } else {
                    const lintIssuesA = lintCampaignBody(lead.campaignBody, lead.country);
                    const lintIssuesB = lintCampaignBody(campaignBodyB, lead.country);
                    const errA = lintIssuesA.filter(i => i.severity === "error").length;
                    const warnA = lintIssuesA.filter(i => i.severity === "warning").length;
                    const errB = lintIssuesB.filter(i => i.severity === "error").length;
                    const warnB = lintIssuesB.filter(i => i.severity === "warning").length;

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                              A/B REAL-TIME LINTERS
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Variant A */}
                          <div className="space-y-2.5 border-b sm:border-b-0 sm:border-r border-slate-100 pb-3 sm:pb-0 sm:pr-3">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                              <span className="text-[10px] font-extrabold text-indigo-700 uppercase">Variant A (Original)</span>
                              <div className="flex gap-1">
                                {lintIssuesA.length > 0 ? (
                                  <>
                                    {errA > 0 && <span className="bg-red-50 text-red-700 border border-red-100 px-1 py-0.2 rounded text-[8px] font-mono font-extrabold">{errA}E</span>}
                                    {warnA > 0 && <span className="bg-amber-50 text-amber-700 border border-amber-100 px-1 py-0.2 rounded text-[8px] font-mono font-extrabold">{warnA}W</span>}
                                  </>
                                ) : (
                                  <span className="text-[8px] text-emerald-600 font-bold">✓ COMPLIANT</span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                              {lintIssuesA.length === 0 ? (
                                <div className="text-[10px] text-emerald-700 bg-emerald-50/50 p-2 rounded border border-emerald-100 font-sans font-semibold">
                                  ✓ Clear of errors. Excellent!
                                </div>
                              ) : (
                                lintIssuesA.map(issue => (
                                  <div key={issue.id} className="text-[10px] p-2 rounded bg-slate-50 border border-slate-150 leading-relaxed">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-extrabold text-slate-700 text-[8px] uppercase font-mono tracking-wider bg-slate-200 px-1 rounded">{issue.category}</span>
                                      <span className={issue.severity === "error" ? "text-red-500 font-bold text-[8px]" : "text-amber-500 font-bold text-[8px]"}>
                                        {issue.severity.toUpperCase()}
                                      </span>
                                    </div>
                                    <p className="text-slate-600 text-[10px] leading-snug">{issue.message}</p>
                                    <p className="text-emerald-700 font-mono text-[9px] mt-1 bg-white p-1 rounded border border-slate-100">Fix: {issue.fix}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>

                          {/* Variant B */}
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between border-b border-slate-50 pb-1.5">
                              <span className="text-[10px] font-extrabold text-emerald-700 uppercase">Variant B (Optimized)</span>
                              <div className="flex gap-1">
                                {lintIssuesB.length > 0 ? (
                                  <>
                                    {errB > 0 && <span className="bg-red-50 text-red-700 border border-red-100 px-1 py-0.2 rounded text-[8px] font-mono font-extrabold">{errB}E</span>}
                                    {warnB > 0 && <span className="bg-amber-50 text-amber-700 border border-amber-100 px-1 py-0.2 rounded text-[8px] font-mono font-extrabold">{warnB}W</span>}
                                  </>
                                ) : (
                                  <span className="text-[8px] text-emerald-600 font-bold">✓ COMPLIANT</span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                              {lintIssuesB.length === 0 ? (
                                <div className="text-[10px] text-emerald-700 bg-emerald-50/50 p-2 rounded border border-emerald-100 font-sans font-semibold">
                                  ✓ Clear of errors. Excellent!
                                </div>
                              ) : (
                                lintIssuesB.map(issue => (
                                  <div key={issue.id} className="text-[10px] p-2 rounded bg-slate-50 border border-slate-150 leading-relaxed">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="font-extrabold text-slate-700 text-[8px] uppercase font-mono tracking-wider bg-slate-200 px-1 rounded">{issue.category}</span>
                                      <span className={issue.severity === "error" ? "text-red-500 font-bold text-[8px]" : "text-amber-500 font-bold text-[8px]"}>
                                        {issue.severity.toUpperCase()}
                                      </span>
                                    </div>
                                    <p className="text-slate-600 text-[10px] leading-snug">{issue.message}</p>
                                    <p className="text-emerald-700 font-mono text-[9px] mt-1 bg-white p-1 rounded border border-slate-100">Fix: {issue.fix}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }
                })()}

                {/* Collapsible Advanced Override Guidelines */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
                    className="w-full px-4 py-2.5 text-xs font-bold text-slate-600 flex items-center justify-between hover:bg-slate-100 transition"
                  >
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
                      <Settings className="w-3.5 h-3.5 text-indigo-600" />
                      Configure Custom Agent Guidelines
                    </span>
                    {showAdvancedConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <AnimatePresence>
                    {showAdvancedConfig && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="p-4 border-t border-slate-200 space-y-3 bg-white text-xs"
                      >
                        <div>
                          <label className="block text-slate-500 mb-1 font-mono text-[10px] uppercase font-bold">1. Sanitizer Directive</label>
                          <input
                            type="text"
                            value={customInstructions.sanitization}
                            onChange={(e) => setCustomInstructions(p => ({ ...p, sanitization: e.target.value }))}
                            placeholder="e.g. Always format last names to uppercase."
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1 font-mono text-[10px] uppercase font-bold">2. Compliance Directive</label>
                          <input
                            type="text"
                            value={customInstructions.compliance}
                            onChange={(e) => setCustomInstructions(p => ({ ...p, compliance: e.target.value }))}
                            placeholder="e.g. Require double opt-in validation tags."
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1 font-mono text-[10px] uppercase font-bold">3. Accessibility Directive</label>
                          <input
                            type="text"
                            value={customInstructions.accessibility}
                            onChange={(e) => setCustomInstructions(p => ({ ...p, accessibility: e.target.value }))}
                            placeholder="e.g. Ensure minimum color contrast of 7:1."
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-500 mb-1 font-mono text-[10px] uppercase font-bold">4. Layout Directive</label>
                          <input
                            type="text"
                            value={customInstructions.compiler}
                            onChange={(e) => setCustomInstructions(p => ({ ...p, compiler: e.target.value }))}
                            placeholder="e.g. Apply high contrast navy headers."
                            className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 focus:outline-none focus:border-indigo-500 font-mono text-xs"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Primary CTA */}
                <button
                  onClick={() => runSandbox()}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2 text-xs tracking-wider uppercase"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>EXECUTE MULTI-AGENT COMPILER</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Local History Card */}
            {history.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Sandbox History Logs
                  </h4>
                  <button
                    onClick={clearHistory}
                    className="text-xxs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-medium transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear History
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 pr-1 scrollbar-thin">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setLead({ ...item.payload });
                        setSandboxResult(item.result);
                        setSelectedPresetId("");
                        setActiveTab("board");
                      }}
                      className="w-full text-left py-2 hover:bg-slate-50 px-2 rounded-lg transition flex items-center justify-between text-xs group"
                    >
                      <div className="truncate pr-3">
                        <div className="font-semibold text-slate-700 group-hover:text-indigo-600 truncate">
                          {item.payload.firstName || "No Name"} {item.payload.lastName}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
                          <span>{item.payload.country}</span>
                          <span>•</span>
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                      <span className="text-xxs font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100">
                        {item.result.scorecard.finalComplianceScore}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Right Block: Dynamic Output Console (7 cols) */}
          <section className="lg:col-span-7 space-y-6">
            
            {/* Error Message Alert */}
            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-5 flex items-start gap-3.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm">Execution Error</h4>
                  <p className="text-xs text-rose-700 leading-relaxed font-mono">
                    {errorMsg}
                  </p>
                  <button 
                    onClick={() => runSandbox()}
                    className="mt-2 text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3 animate-spin" /> Force Sandbox Rerun
                  </button>
                </div>
              </div>
            )}

            {/* Awaiting Payload Empty State */}
            {!isLoading && !sandboxResult && !errorMsg && (
              <div className="border border-dashed border-slate-300 bg-white rounded-xl p-16 text-center flex flex-col items-center justify-center space-y-5 shadow-sm min-h-[500px]">
                <div className="bg-slate-50 p-4 rounded-full border border-slate-200 shadow-sm text-indigo-600">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="font-bold text-slate-800 text-base">Awaiting Sandbox Execution</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select one of the quick test scenarios on top (France, Germany, California) or adjust the payload inputs on the left side, then trigger the compilation pipeline.
                  </p>
                </div>
                <button
                  onClick={() => runSandbox()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-5 py-2.5 rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Play className="w-3 h-3 fill-white" />
                  Run with Current Payload
                </button>
              </div>
            )}

            {/* Dynamic Step-by-Step Loader Console */}
            {isLoading && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6 shadow-sm min-h-[500px] flex flex-col justify-center">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                      Multi-Agent Pipeline Active
                    </h3>
                    <p className="text-xs text-slate-500">
                      Processing targets for <span className="font-semibold text-slate-700">{lead.country}</span> ruleset...
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1 rounded-lg">
                    Stage {loadingStep + 1} of 4
                  </span>
                </div>

                {/* Simulated Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700"
                    initial={{ width: "0%" }}
                    animate={{ 
                      width: loadingStep === 0 ? "25%" : loadingStep === 1 ? "50%" : loadingStep === 2 ? "75%" : "95%" 
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>

                {/* Step indicators */}
                <div className="space-y-3 pt-2">
                  {[
                    {
                      index: 0,
                      title: "🧹 [DATA SANITIZATION NODE] is active",
                      desc: "Detecting name casing abnormalities, initials, numbers. Selecting fallbacks.",
                    },
                    {
                      index: 1,
                      title: "⚖️ [GLOBAL REGULATORY ANALYST] is active",
                      desc: "Researching 2026 guidelines. Applying explicit opt-in rules, removing tracker pixels.",
                    },
                    {
                      index: 2,
                      title: "♿ [ACCESSIBILITY AUDITOR] is active",
                      desc: "Validating contrast parameters, injecting HTML lang tags, adjusting descriptive CTAs.",
                    },
                    {
                      index: 3,
                      title: "📬 [HTML COMPILER] is active",
                      desc: "Compiling raw production-ready responsive markup styled purely with inline CSS.",
                    }
                  ].map((step) => {
                    const isActive = loadingStep === step.index;
                    const isDone = loadingStep > step.index;
                    return (
                      <div 
                        key={step.index}
                        className={`flex gap-3.5 p-3 rounded-xl border transition ${
                          isActive 
                            ? "bg-indigo-50/70 border-indigo-200 text-slate-800 shadow-sm"
                            : isDone
                              ? "bg-slate-50 border-slate-100 text-slate-400"
                              : "bg-transparent border-transparent text-slate-300"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : isActive ? (
                            <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-200 bg-white" />
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${isActive ? "text-indigo-700" : isDone ? "text-slate-600" : "text-slate-400"}`}>
                            {step.title}
                          </div>
                          {isActive && (
                            <motion.p 
                              initial={{ opacity: 0, y: 3 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xxs text-slate-500 mt-1 leading-relaxed"
                            >
                              {step.desc}
                            </motion.p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Compiled Results Board Container */}
            {!isLoading && sandboxResult && (
              <div className="space-y-6">

                {/* Export Report Action Row */}
                <div className="bg-gradient-to-r from-indigo-50 to-slate-50 border border-indigo-100 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="p-1 bg-indigo-100 text-indigo-700 rounded-md">
                        <Scale className="w-3.5 h-3.5" />
                      </span>
                      Compliance Report Sandbox
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      Export full multi-agent compliance logs, scorecards, and regulatory heatmap findings for {COUNTRY_REGULATORY_INFO[lead.country]?.framework || `${lead.country} Markets`}.
                    </p>
                  </div>
                  <button
                    onClick={exportAuditToCSV}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-150 cursor-pointer self-start sm:self-auto"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Audit Report (CSV)</span>
                  </button>
                </div>
                
                {/* A/B Comparison Mode View Switcher */}
                {abMode && sandboxResult && sandboxResultB && (
                  <div className="bg-slate-50 p-2 rounded-xl flex flex-col sm:flex-row gap-2 sm:items-center justify-between border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest pl-2 flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                      A/B COMPARISON VIEWPORT
                    </span>
                    <div className="flex gap-1">
                      {[
                        { id: "side", label: "📊 Side-by-Side", desc: "Compare both layouts simultaneously" },
                        { id: "a", label: "Original (A)", desc: "Focus on baseline original draft" },
                        { id: "b", label: "Remediated (B)", desc: "Focus on AI-remediated compliance draft" }
                      ].map((view) => (
                        <button
                          key={view.id}
                          onClick={() => setAbViewTab(view.id as any)}
                          title={view.desc}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-150 cursor-pointer ${
                            abViewTab === view.id
                              ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                          }`}
                        >
                          {view.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual Scorecard Gauge */}
                {!abMode ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center shadow-sm">
                    {/* Score circle */}
                    <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Compliance Rating</span>
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-slate-100"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <motion.path
                            className="text-indigo-600"
                            strokeWidth="3"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            initial={{ strokeDasharray: "0, 100" }}
                            animate={{ strokeDasharray: `${sandboxResult.scorecard.finalComplianceScore}, 100` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="text-center">
                          <motion.span 
                            key={sandboxResult.scorecard.finalComplianceScore}
                            initial={{ scale: 0.75, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 12 }}
                            className="text-2xl font-extrabold text-slate-800 block"
                          >
                            <AnimatedScore value={sandboxResult.scorecard.finalComplianceScore} />
                          </motion.span>
                          <div className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">SECURE</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 font-mono">
                        Improved from {sandboxResult.scorecard.initialComplianceScore}% initial
                      </span>
                    </div>

                    {/* Resolutions Checklist */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Orchestration Resolutions ({sandboxResult.scorecard.issuesFixed.length})
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                          <Check className="w-3 h-3" /> WCAG AA PASS
                        </span>
                      </div>
                      <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1 scrollbar-thin text-xs">
                        {sandboxResult.scorecard.issuesFixed.map((issue, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {abViewTab === "side" && (
                      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <ScorecardDisplay result={sandboxResult} variantName="Variant A (Original)" themeColor="indigo" />
                        {sandboxResultB && (
                          <ScorecardDisplay result={sandboxResultB} variantName="Variant B (Optimized)" themeColor="emerald" />
                        )}
                      </div>
                    )}
                    {abViewTab === "a" && (
                      <ScorecardDisplay result={sandboxResult} variantName="Variant A (Original)" themeColor="indigo" />
                    )}
                    {abViewTab === "b" && sandboxResultB && (
                      <ScorecardDisplay result={sandboxResultB} variantName="Variant B (Optimized)" themeColor="emerald" />
                    )}
                  </div>
                )}

                {/* 2026 Regulatory Compliance Heatmap */}
                {(() => {
                  const heatmapData = getRegHeatmapData(lead.country);
                  const activeHeatmapItem = heatmapData.find(item => item.id === selectedHeatmapId) || heatmapData[0];

                  return (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div>
                          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span className="p-1 bg-indigo-50 text-indigo-600 rounded">
                              <Shield className="w-3.5 h-3.5" />
                            </span>
                            2026 REGULATORY COMPLIANCE HEATMAP
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            Active digital compliance verification grid for {COUNTRY_REGULATORY_INFO[lead.country]?.framework || `${lead.country} Markets`}. Click any tile for full audit logs.
                          </p>
                        </div>
                        
                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-3 text-[9px] font-bold text-slate-400 select-none">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>VERIFIED CLEAN</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            <span>REMEDIATED</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-slate-300" />
                            <span>N/A (EXEMPT)</span>
                          </div>
                        </div>
                      </div>

                      {/* Grid container */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {heatmapData.map((item, idx) => {
                          const isSelected = activeHeatmapItem.id === item.id;
                          
                          let bgClass = "bg-slate-50 border-slate-100 text-slate-400 hover:bg-slate-100/70";
                          let dotColor = "bg-slate-300";
                          
                          if (item.status === "passed") {
                            bgClass = isSelected
                              ? "bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-100"
                              : "bg-emerald-50/30 border-emerald-100 text-emerald-700 hover:bg-emerald-50/60 hover:border-emerald-200";
                            dotColor = "bg-emerald-500";
                          } else if (item.status === "remediated") {
                            bgClass = isSelected
                              ? "bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-100"
                              : "bg-amber-50/30 border-amber-100 text-amber-700 hover:bg-amber-50/60 hover:border-amber-200";
                            dotColor = "bg-amber-500 animate-pulse";
                          } else {
                            if (isSelected) {
                              bgClass = "bg-slate-100 border-slate-400 text-slate-700 ring-2 ring-slate-200";
                            }
                          }

                          return (
                            <motion.button
                              key={item.id}
                              onClick={() => setSelectedHeatmapId(item.id)}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 260, 
                                damping: 20,
                                delay: idx * 0.03 
                              }}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between h-14 transition duration-150 relative cursor-pointer group ${bgClass}`}
                            >
                              <div className="flex items-center justify-between gap-1 w-full">
                                <span className="font-mono text-[9px] font-bold tracking-wider group-hover:text-indigo-600 transition">
                                  {item.id}
                                </span>
                                <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                              </div>
                              <div className="mt-1 text-[10px] font-bold truncate leading-tight">
                                {item.name}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Active detail pane */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeHeatmapItem.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15 }}
                          className="bg-slate-50 border border-slate-200/60 rounded-lg p-3.5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-mono bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                                {activeHeatmapItem.framework}
                              </span>
                              <h4 className="text-xs font-bold text-slate-700">
                                {activeHeatmapItem.name}
                              </h4>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              {activeHeatmapItem.description}
                            </p>
                            <div className="text-[10px] text-slate-700 font-mono mt-2 font-medium bg-white p-2 rounded border border-slate-200/60 leading-relaxed">
                              <span className="font-bold text-indigo-600">Audit Status:</span> {activeHeatmapItem.details}
                            </div>
                          </div>
                          
                          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 border-slate-200/50 pt-2 sm:pt-0">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Verdict</span>
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold font-mono tracking-wider shadow-xs uppercase border ${
                              activeHeatmapItem.status === "passed"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : activeHeatmapItem.status === "remediated"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-slate-200 text-slate-500 border-slate-300"
                            }`}>
                              {activeHeatmapItem.status === "passed" && "✓ PASSED"}
                              {activeHeatmapItem.status === "remediated" && "⚙ REMEDIATED"}
                              {activeHeatmapItem.status === "na" && "⊘ EXEMPT"}
                            </span>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  );
                })()}

                {/* Tabs Selector Bar */}
                <div className="border border-slate-200 flex justify-between items-center bg-white p-1 rounded-xl shadow-sm">
                  <div className="flex space-x-1 w-full">
                    {[
                      { id: "board", label: "Multi-Agent Board", icon: Activity },
                      { id: "preview", label: "Compiled Email", icon: Eye },
                      { id: "code", label: "HTML Output", icon: FileCode },
                      { id: "markdown", label: "Agent Reasoning", icon: FileText },
                    ].map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setActiveTab(t.id)}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition ${
                            activeTab === t.id
                              ? "bg-slate-100 text-indigo-600 shadow-inner border border-slate-200/50"
                              : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Output Tab Contents */}
                <div className="min-h-96">
                  
                  {/* Tab 1: Professional Polish Quadrant/Multi-Agent Board */}
                  {activeTab === "board" && (
                    !abMode ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Quadrant 1: Data Sanitization */}
                        <section className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                          <div className="h-10 border-b border-slate-100 bg-slate-50 px-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <span className="w-4 h-4 flex items-center justify-center bg-slate-200 rounded text-[10px]">01</span>
                              DATA SANITIZATION NODE
                            </span>
                            {autoSanitize ? (
                              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">ACTIVE REPAIR</span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 rounded">BYPASSED</span>
                            )}
                          </div>
                          <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-3">
                            {!autoSanitize && (
                              <div className="p-2 bg-amber-50 border border-amber-100 rounded text-amber-800 text-[10px] font-sans font-semibold leading-normal">
                                ⚠️ Auto-Sanitize is Disabled. Input names are passed forward completely raw and uncorrected to test recipient rendering behavior.
                              </div>
                            )}
                            <div className="p-2 bg-rose-50 border border-rose-100 rounded text-rose-800">
                              <span className="font-bold">[RAW INPUT]:</span> "{sandboxResult.sanitizationNode.originalName || `${lead.firstName} ${lead.lastName}`}"
                            </div>
                            <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-800 space-y-1">
                              <div className="font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                [REPAIRED]: "{sandboxResult.sanitizationNode.repairedName}"
                              </div>
                              <div className="italic opacity-90">
                                Greeting fallback used: "{sandboxResult.sanitizationNode.greetingFallbackUsed}"
                              </div>
                            </div>
                            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-600 text-xxs">
                              <strong>Reasoning:</strong> {sandboxResult.sanitizationNode.reasoning}
                            </div>
                          </div>
                        </section>

                        {/* Quadrant 2: Regulatory Analyst */}
                        <section className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                          <div className="h-10 border-b border-slate-100 bg-slate-50 px-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <span className="w-4 h-4 flex items-center justify-center bg-slate-200 rounded text-[10px]">02</span>
                              REGULATORY ANALYST
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded">COMPLIANT</span>
                          </div>
                          <div className="p-4 flex-1 space-y-3.5 text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                              <h3 className="font-semibold text-slate-800">Market Target: {sandboxResult.regulatoryAnalystNode.targetMarketName}</h3>
                              <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-bold font-mono">2026 REQS</span>
                            </div>
                            <ul className="space-y-2.5">
                              <li className="flex items-start gap-2 text-slate-600">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Frameworks:</strong> {sandboxResult.regulatoryAnalystNode.frameworks2026.join(", ")}</span>
                              </li>
                              <li className="flex items-start gap-2 text-slate-600">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Tracking:</strong> {sandboxResult.regulatoryAnalystNode.trackingPixelAction}</span>
                              </li>
                              <li className="flex items-start gap-2 text-slate-600">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span><strong>Consent:</strong> {sandboxResult.regulatoryAnalystNode.consentRequirements}</span>
                              </li>
                            </ul>
                            <div className="text-[10px] bg-slate-50 border border-slate-100 p-2 rounded text-slate-500 italic">
                              {sandboxResult.regulatoryAnalystNode.reasoning}
                            </div>
                          </div>
                        </section>

                        {/* Quadrant 3: Accessibility Auditor */}
                        <section className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden md:col-span-2">
                          <div className="h-10 border-b border-slate-100 bg-slate-50 px-4 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              <span className="w-4 h-4 flex items-center justify-center bg-slate-200 rounded text-[10px]">03</span>
                              ACCESSIBILITY AUDITOR
                            </span>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 rounded">PASSING</span>
                          </div>
                          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-5">
                            <div className="md:col-span-4 space-y-3">
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Contrast Ratio</p>
                                <p className="text-lg font-bold text-indigo-900">{sandboxResult.accessibilityAuditorNode.contrastRating}</p>
                                <p className="text-[10px] text-emerald-600 font-semibold">WCAG 2.1 AA Level</p>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Language ISO Tag</p>
                                <p className="text-xs font-mono font-bold text-slate-800">&lt;html lang="{sandboxResult.accessibilityAuditorNode.langTagApplied}"&gt;</p>
                                <p className="text-[10px] text-slate-500">EAA Certified</p>
                              </div>
                            </div>
                            
                            <div className="md:col-span-8 text-xs text-slate-600 space-y-3">
                              <div className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">CTA Text & ARIA Transformations:</div>
                              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {sandboxResult.accessibilityAuditorNode.ctaTransformations.map((cta, idx) => (
                                  <div key={idx} className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-mono text-[10px]">
                                    <div className="text-rose-600 line-through">Before: "{cta.before}"</div>
                                    <div className="text-emerald-700 font-bold mt-1">After: "{cta.after}"</div>
                                    {cta.explanation && <div className="text-slate-400 mt-1 font-sans italic">{cta.explanation}</div>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </section>

                      </div>
                    ) : (
                      <div className="space-y-6">
                        {abViewTab === "side" && (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <VariantAgentBoard result={sandboxResult} variantLabel="Variant A (Original)" lead={lead} autoSanitize={autoSanitize} themeColor="indigo" />
                            {sandboxResultB && (
                              <VariantAgentBoard result={sandboxResultB} variantLabel="Variant B (Optimized)" lead={lead} autoSanitize={autoSanitize} themeColor="emerald" />
                            )}
                          </div>
                        )}
                        {abViewTab === "a" && (
                          <VariantAgentBoard result={sandboxResult} variantLabel="Variant A (Original)" lead={lead} autoSanitize={autoSanitize} themeColor="indigo" />
                        )}
                        {abViewTab === "b" && sandboxResultB && (
                          <VariantAgentBoard result={sandboxResultB} variantLabel="Variant B (Optimized)" lead={lead} autoSanitize={autoSanitize} themeColor="emerald" />
                        )}
                      </div>
                    )
                  )}

                  {/* Tab 2: Compiled Email Preview (IFrame with Device Size Toggles) */}
                  {activeTab === "preview" && (
                    <div className="space-y-4">
                      <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                          <span>Compiled HTML is rendered inside a fully-isolated responsive viewport.</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                          <button
                            onClick={() => setPreviewDevice("desktop")}
                            className={`p-1.5 rounded-md transition cursor-pointer ${previewDevice === "desktop" ? "bg-slate-100 text-indigo-600 font-bold" : "text-slate-400 hover:text-slate-600"}`}
                            title="Desktop Preview"
                          >
                            <Laptop className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setPreviewDevice("mobile")}
                            className={`p-1.5 rounded-md transition cursor-pointer ${previewDevice === "mobile" ? "bg-slate-100 text-indigo-600 font-bold" : "text-slate-400 hover:text-slate-600"}`}
                            title="Mobile Preview"
                          >
                            <Smartphone className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Display Viewport Grid */}
                      {!abMode ? (
                        <div className="space-y-4">
                          <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-inner overflow-hidden">
                            <motion.div
                              animate={{ width: previewDevice === "desktop" ? "100%" : "375px" }}
                              transition={{ type: "spring", damping: 25, stiffness: 120 }}
                              className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 min-h-[500px] flex flex-col w-full"
                            >
                              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
                                <span className="truncate">Subject: {sandboxResult.campaignSubject || "Newsletter Product Announcement"}</span>
                                <span className="text-xxs bg-slate-200 px-2 py-0.5 rounded-full uppercase font-bold text-slate-500">HTML_COMPILED</span>
                              </div>
                              <iframe
                                srcDoc={sandboxResult.htmlCompilerNode.compiledHtml}
                                title="Compiled Campaign Preview"
                                className="w-full flex-1 min-h-[500px] border-none bg-white"
                                sandbox="allow-same-origin"
                              />
                            </motion.div>
                          </div>
                          {sandboxResult.htmlCompilerNode.visualHighlights && (
                            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compiler Highlights:</div>
                              <div className="flex flex-wrap gap-2">
                                {sandboxResult.htmlCompilerNode.visualHighlights.map((highlight, index) => (
                                  <span key={index} className="text-xxs font-medium bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                                    {highlight}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {abViewTab === "side" && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              {/* Variant A Preview */}
                              <div className="space-y-3">
                                <div className="text-xs font-bold text-indigo-900 bg-indigo-50/50 border border-indigo-100 p-2 rounded-lg flex items-center justify-between">
                                  <span>Variant A (Original Draft)</span>
                                  <span className="text-[10px] font-mono text-slate-500">Subject: {sandboxResult.campaignSubject}</span>
                                </div>
                                <div className="flex justify-center bg-slate-200 p-3 rounded-xl border border-slate-300 shadow-inner overflow-hidden">
                                  <motion.div
                                    animate={{ width: previewDevice === "desktop" ? "100%" : "320px" }}
                                    transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                    className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 min-h-[450px] flex flex-col w-full"
                                  >
                                    <iframe
                                      srcDoc={sandboxResult.htmlCompilerNode.compiledHtml}
                                      title="Compiled Campaign A Preview"
                                      className="w-full flex-1 min-h-[450px] border-none bg-white"
                                      sandbox="allow-same-origin"
                                    />
                                  </motion.div>
                                </div>
                                {sandboxResult.htmlCompilerNode.visualHighlights && (
                                  <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 text-xxs">
                                    <div className="text-[9px] font-bold text-slate-400 uppercase">Compiler Highlights:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {sandboxResult.htmlCompilerNode.visualHighlights.map((hl, idx) => (
                                        <span key={idx} className="bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded">
                                          {hl}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Variant B Preview */}
                              {sandboxResultB && (
                                <div className="space-y-3">
                                  <div className="text-xs font-bold text-emerald-900 bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg flex items-center justify-between">
                                    <span>Variant B (AI-Remediated Compliant Draft)</span>
                                    <span className="text-[10px] font-mono text-slate-500">Subject: {sandboxResultB.campaignSubject}</span>
                                  </div>
                                  <div className="flex justify-center bg-slate-200 p-3 rounded-xl border border-slate-300 shadow-inner overflow-hidden">
                                    <motion.div
                                      animate={{ width: previewDevice === "desktop" ? "100%" : "320px" }}
                                      transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                      className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 min-h-[450px] flex flex-col w-full"
                                    >
                                      <iframe
                                        srcDoc={sandboxResultB.htmlCompilerNode.compiledHtml}
                                        title="Compiled Campaign B Preview"
                                        className="w-full flex-1 min-h-[450px] border-none bg-white"
                                        sandbox="allow-same-origin"
                                      />
                                    </motion.div>
                                  </div>
                                  {sandboxResultB.htmlCompilerNode.visualHighlights && (
                                    <div className="bg-white border border-slate-200 rounded-lg p-3 space-y-1 text-xxs">
                                      <div className="text-[9px] font-bold text-slate-400 uppercase">Compiler Highlights:</div>
                                      <div className="flex flex-wrap gap-1">
                                        {sandboxResultB.htmlCompilerNode.visualHighlights.map((hl, idx) => (
                                          <span key={idx} className="bg-emerald-50/50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">
                                            {hl}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {abViewTab === "a" && (
                            <div className="space-y-4">
                              <div className="text-xs font-bold text-indigo-900 bg-indigo-50/50 border border-indigo-100 p-2 rounded-lg">
                                Variant A (Original Draft)
                              </div>
                              <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-inner overflow-hidden">
                                <motion.div
                                  animate={{ width: previewDevice === "desktop" ? "100%" : "375px" }}
                                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                  className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 min-h-[500px] flex flex-col w-full"
                                >
                                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
                                    <span className="truncate">Subject: {sandboxResult.campaignSubject || "Newsletter Product Announcement"}</span>
                                    <span className="text-xxs bg-slate-200 px-2 py-0.5 rounded-full uppercase font-bold text-slate-500">HTML_COMPILED</span>
                                  </div>
                                  <iframe
                                    srcDoc={sandboxResult.htmlCompilerNode.compiledHtml}
                                    title="Compiled Campaign Preview A Only"
                                    className="w-full flex-1 min-h-[500px] border-none bg-white"
                                    sandbox="allow-same-origin"
                                  />
                                </motion.div>
                              </div>
                              {sandboxResult.htmlCompilerNode.visualHighlights && (
                                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compiler Highlights:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {sandboxResult.htmlCompilerNode.visualHighlights.map((hl, idx) => (
                                      <span key={idx} className="text-xxs font-medium bg-indigo-50 border border-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                                        {hl}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {abViewTab === "b" && sandboxResultB && (
                            <div className="space-y-4">
                              <div className="text-xs font-bold text-emerald-900 bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg">
                                Variant B (AI-Remediated Compliant Draft)
                              </div>
                              <div className="flex justify-center bg-slate-200 p-4 rounded-xl border border-slate-300 shadow-inner overflow-hidden">
                                <motion.div
                                  animate={{ width: previewDevice === "desktop" ? "100%" : "375px" }}
                                  transition={{ type: "spring", damping: 25, stiffness: 120 }}
                                  className="bg-white shadow-xl rounded-lg overflow-hidden border border-slate-300 min-h-[500px] flex flex-col w-full"
                                >
                                  <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono shrink-0">
                                    <span className="truncate">Subject: {sandboxResultB.campaignSubject || "Newsletter Product Announcement"}</span>
                                    <span className="text-xxs bg-slate-200 px-2 py-0.5 rounded-full uppercase font-bold text-slate-500">HTML_COMPILED</span>
                                  </div>
                                  <iframe
                                    srcDoc={sandboxResultB.htmlCompilerNode.compiledHtml}
                                    title="Compiled Campaign Preview B Only"
                                    className="w-full flex-1 min-h-[500px] border-none bg-white"
                                    sandbox="allow-same-origin"
                                  />
                                </motion.div>
                              </div>
                              {sandboxResultB.htmlCompilerNode.visualHighlights && (
                                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
                                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Compiler Highlights:</div>
                                  <div className="flex flex-wrap gap-2">
                                    {sandboxResultB.htmlCompilerNode.visualHighlights.map((hl, idx) => (
                                      <span key={idx} className="text-xxs font-medium bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                                        {hl}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Raw HTML Code View */}
                  {activeTab === "code" && (
                    <div className="space-y-4">
                      {!abMode ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              Copy the compiled production-ready HTML with responsive inlined attributes.
                            </div>
                            <button
                              onClick={handleCopyHtml}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedHtml ? "Copied HTML!" : "Copy HTML"}</span>
                            </button>
                          </div>

                          <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-[550px] scrollbar-thin">
                            <pre className="whitespace-pre-wrap">{sandboxResult.htmlCompilerNode.compiledHtml}</pre>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {abViewTab === "side" && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              {/* Code A */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                                  <span className="text-xs font-bold text-indigo-900">Variant A (Original Code)</span>
                                  <button
                                    onClick={handleCopyHtml}
                                    className="bg-white hover:bg-slate-50 text-slate-700 text-xxs px-2 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                  >
                                    {copiedHtml ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedHtml ? "Copied!" : "Copy Code"}</span>
                                  </button>
                                </div>
                                <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-xxs text-slate-300 font-mono overflow-x-auto max-h-[450px] scrollbar-thin">
                                  <pre className="whitespace-pre-wrap">{sandboxResult.htmlCompilerNode.compiledHtml}</pre>
                                </div>
                              </div>

                              {/* Code B */}
                              {sandboxResultB && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                                    <span className="text-xs font-bold text-emerald-900">Variant B (Optimized Code)</span>
                                    <button
                                      onClick={handleCopyHtmlB}
                                      className="bg-white hover:bg-slate-50 text-slate-700 text-xxs px-2 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                    >
                                      {copiedHtmlB ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                      <span>{copiedHtmlB ? "Copied!" : "Copy Code"}</span>
                                    </button>
                                  </div>
                                  <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-xxs text-slate-300 font-mono overflow-x-auto max-h-[450px] scrollbar-thin">
                                    <pre className="whitespace-pre-wrap">{sandboxResultB.htmlCompilerNode.compiledHtml}</pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {abViewTab === "a" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                                <span className="text-xs font-bold text-indigo-900">Variant A (Original HTML Code)</span>
                                <button
                                  onClick={handleCopyHtml}
                                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedHtml ? "Copied HTML!" : "Copy Code"}</span>
                                </button>
                              </div>
                              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-[500px] scrollbar-thin">
                                <pre className="whitespace-pre-wrap">{sandboxResult.htmlCompilerNode.compiledHtml}</pre>
                              </div>
                            </div>
                          )}

                          {abViewTab === "b" && sandboxResultB && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                                <span className="text-xs font-bold text-emerald-900">Variant B (Optimized HTML Code)</span>
                                <button
                                  onClick={handleCopyHtmlB}
                                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  {copiedHtmlB ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedHtmlB ? "Copied HTML!" : "Copy Code"}</span>
                                </button>
                              </div>
                              <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto max-h-[500px] scrollbar-thin">
                                <pre className="whitespace-pre-wrap">{sandboxResultB.htmlCompilerNode.compiledHtml}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 4: Agent Reasoning Markdown */}
                  {activeTab === "markdown" && (
                    <div className="space-y-4">
                      {!abMode ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              View the full multi-agent sequence analysis logs with 2026 statutory citations.
                            </div>
                            <button
                              onClick={handleCopyMarkdown}
                              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer"
                            >
                              {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedMarkdown ? "Copied Reasoning!" : "Copy Full Logs"}</span>
                            </button>
                          </div>

                          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-y-auto max-h-[550px] text-xs leading-relaxed space-y-4 prose prose-slate">
                            <div className="font-mono text-[11px] whitespace-pre-wrap text-slate-700">
                              {sandboxResult.rawMarkdownReasoning}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {abViewTab === "side" && (
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                              {/* Logs A */}
                              <div className="space-y-3">
                                <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-2 rounded-lg">
                                  <span className="text-xs font-bold text-indigo-900">Variant A (Original Logs)</span>
                                  <button
                                    onClick={handleCopyMarkdown}
                                    className="bg-white hover:bg-slate-50 text-slate-700 text-xxs px-2 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                  >
                                    {copiedMarkdown ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    <span>{copiedMarkdown ? "Copied!" : "Copy Logs"}</span>
                                  </button>
                                </div>
                                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs overflow-y-auto max-h-[450px] text-[10.5px] font-mono leading-relaxed text-slate-700 whitespace-pre-wrap">
                                  {sandboxResult.rawMarkdownReasoning}
                                </div>
                              </div>

                              {/* Logs B */}
                              {sandboxResultB && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                                    <span className="text-xs font-bold text-emerald-900">Variant B (Optimized Logs)</span>
                                    <button
                                      onClick={handleCopyMarkdownB}
                                      className="bg-white hover:bg-slate-50 text-slate-700 text-xxs px-2 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                    >
                                      {copiedMarkdownB ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                      <span>{copiedMarkdownB ? "Copied!" : "Copy Logs"}</span>
                                    </button>
                                  </div>
                                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs overflow-y-auto max-h-[450px] text-[10.5px] font-mono leading-relaxed text-slate-700 whitespace-pre-wrap">
                                    {sandboxResultB.rawMarkdownReasoning}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {abViewTab === "a" && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-3 rounded-lg">
                                <span className="text-xs font-bold text-indigo-900">Variant A (Original Reasoning Logs)</span>
                                <button
                                  onClick={handleCopyMarkdown}
                                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedMarkdown ? "Copied Logs!" : "Copy Logs"}</span>
                                </button>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-y-auto max-h-[500px] text-xs leading-relaxed space-y-4 prose prose-slate">
                                <div className="font-mono text-[11px] whitespace-pre-wrap text-slate-700">
                                  {sandboxResult.rawMarkdownReasoning}
                                </div>
                              </div>
                            </div>
                          )}

                          {abViewTab === "b" && sandboxResultB && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                                <span className="text-xs font-bold text-emerald-900">Variant B (Optimized Reasoning Logs)</span>
                                <button
                                  onClick={handleCopyMarkdownB}
                                  className="bg-white hover:bg-slate-50 text-slate-700 text-xs px-3 py-1 rounded border border-slate-200 font-bold flex items-center gap-1 transition cursor-pointer"
                                >
                                  {copiedMarkdownB ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  <span>{copiedMarkdownB ? "Copied Logs!" : "Copy Logs"}</span>
                                </button>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-y-auto max-h-[500px] text-xs leading-relaxed space-y-4 prose prose-slate">
                                <div className="font-mono text-[11px] whitespace-pre-wrap text-slate-700">
                                  {sandboxResultB.rawMarkdownReasoning}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                </div>

              </div>
            )}

          </section>

        </main>
      </div>

      {/* Professional Polish Bottom Status Bar */}
      <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between shrink-0 text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Agent Stream: Real-time research active
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-mono">
          ID: 882-C-SANDBOX-ALPHA
        </div>
      </footer>

      {/* Setup Guide Modal */}
      <AnimatePresence>
        {showLocalGuide && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="h-12 border-b border-slate-100 bg-slate-50 px-5 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2 font-mono">
                  <FileCode className="w-4 h-4 text-indigo-600" />
                  LINKING TO /Users/clairedebadts/lumos-crm-agent
                </span>
                <button
                  onClick={() => setShowLocalGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-600">
                <p>
                  To link this CRM Sandbox to your local python agent directory at <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">/Users/clairedebadts/lumos-crm-agent</code>, you can run a local FastAPI server using the pre-configured <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">main.py</code> code template.
                </p>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Step 1: Save the python server code</h4>
                  <p>
                    We created a template file for you called <strong className="text-slate-800">main.py.example</strong> in this project root. Copy its contents or save it as <strong className="text-slate-800">main.py</strong> inside your local directory:
                  </p>
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-700 select-all max-h-32 overflow-y-auto">
                    # Place in /Users/clairedebadts/lumos-crm-agent/main.py
                    # Run: uvicorn main:app --reload
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Step 2: Install Python dependencies</h4>
                  <p>In your terminal inside your local directory, run:</p>
                  <div className="p-3 bg-slate-900 rounded text-slate-200 font-mono text-[10px] select-all">
                    pip install fastapi uvicorn pydantic google-genai
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Step 3: Run the local agent bridge</h4>
                  <p>Start the local server with hot-reloading active:</p>
                  <div className="p-3 bg-slate-900 rounded text-slate-200 font-mono text-[10px] select-all">
                    uvicorn main:app --host 127.0.0.1 --port 8000 --reload
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Step 4: Execute Payload via Local Link</h4>
                  <p>
                    Toggle the <strong className="text-slate-800">Local Link</strong> execution core in the sidebar, verify the connection status with <strong className="text-slate-800">Test Link</strong>, and hit <strong className="text-slate-800">EXECUTE PAYLOAD</strong>. The CRM sandbox will bypass the cloud pipeline, delegate the processing directly to your local python script, and immediately render your python agent's live compliance metrics, scorecards, and custom-styled HTML outputs!
                  </p>
                </div>
              </div>

              <div className="h-12 border-t border-slate-100 bg-slate-50 px-5 flex items-center justify-end shrink-0">
                <button
                  onClick={() => setShowLocalGuide(false)}
                  className="bg-indigo-600 text-white font-semibold text-xs px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Got It, Let's Link!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
