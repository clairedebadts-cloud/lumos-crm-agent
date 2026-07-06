import { PresetScenario } from "./types";

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "scen-fr",
    title: "France - CNIL GDPR Enforcement",
    countryName: "France",
    countryCode: "FR",
    description: "Messy client casing, hidden tracking pixel, missing opt-out mechanism.",
    icon: "🇫🇷",
    payload: {
      firstName: "jEAN-pIERRE",
      lastName: "d'aRTOIS",
      email: "jp.dartois@messy.fr",
      country: "FR",
      campaignSubject: "Offre Spéciale d'été de Notre Newsletter",
      campaignBody: `Bonjour Jean-Pierre! Profitez de nos offres d'été exclusives.

Nous avons inclus une petite image de pixel invisible dans cet e-mail pour savoir quand et où vous l'ouvrez afin de mieux cibler nos futures publicités.

Cliquez ici pour voir l'offre: www.notre-site.fr/offres-ete

Merci pour votre fidélité!`
    }
  },
  {
    id: "scen-de",
    title: "Germany - UWG Compliance & Impressum",
    countryName: "Germany",
    countryCode: "DE",
    description: "Initialed name, cold-email indicators, missing corporate Imprint (Impressum).",
    icon: "🇩🇪",
    payload: {
      firstName: "M.",
      lastName: "S.",
      email: "schmidt@gmbh.de",
      country: "DE",
      campaignSubject: "Exklusive Einladung zu unserem Q3 Cybersecurity Webinar",
      campaignBody: `Hallo M. S.,

Wir haben Ihre Kontaktdaten auf Ihrer Website gefunden und laden Sie herzlich zu unserem Q3 Webinar ein. Sie müssen sich unbedingt registrieren!

Klicken Sie einfach hier um Ihren Platz zu sichern: www.gmbh.de/webinar-register

Beste Grüße,
Webinar-Team`
    }
  },
  {
    id: "scen-ca",
    title: "California - CCPA/CPRA Privacy Audit",
    countryName: "California (US)",
    countryCode: "US-CA",
    description: "Unsanitized numeric name tags, indicators of sharing data with affiliates, missing consumer rights link.",
    icon: "🇺🇸",
    payload: {
      firstName: "alice_94",
      lastName: "smith",
      email: "alice.smith@california.com",
      country: "US-CA",
      campaignSubject: "Your personalized lifestyle profile is ready!",
      campaignBody: `Hey alice_94,

Your profile is ready. We share or sell some of this lifestyle data to our marketing affiliates to create targeted offers for you.

Go here to see details and make modifications: www.calilifestyle.com/profile

If you don't like it, you can email us to remove it.`
    }
  },
  {
    id: "scen-it",
    title: "Italy - Garante Privacy Guard",
    countryName: "Italy",
    countryCode: "IT",
    description: "Messy case styling, unsolicited list inclusion, silent cookies mention.",
    icon: "🇮🇹",
    payload: {
      firstName: "mArCo",
      lastName: "rOsSi",
      email: "marco.rossi@outlook.it",
      country: "IT",
      campaignSubject: "Nuovi aggiornamenti tecnologici per te",
      campaignBody: `Ciao mArCo rOsSi,

Ti abbiamo iscritto alla nostra lista perché hai mostrato interesse in passato. Analizzeremo le tue letture tramite tracciamento automatico per offrirti i migliori articoli.

Clicca qua per accedere agli articoli: www.techblog.it/articoli

Un saluto`
    }
  },
  {
    id: "scen-jp",
    title: "Japan - APPI Cultural Alignment",
    countryName: "Japan",
    countryCode: "JP",
    description: "Unsanitized English capitals, missing honorifics, missing clear contact desk details.",
    icon: "🇯🇵",
    payload: {
      firstName: "yuki",
      lastName: "TANAKA",
      email: "yuki.tanaka@corp.jp",
      country: "JP",
      campaignSubject: "最新のセキュリティ製品のご案内と特別割引",
      campaignBody: `yuki TANAKAさん、こんにちは。

弊社の新しいセキュリティ製品のご案内です。このメールは弊社の展示会にお越しいただいた方にお送りしています。

こちらをクリックして製品詳細を確認し、割引クーポンを入手してください： www.security-corp.jp/coupon

よろしくお願いいたします。`
    }
  }
];

export const COUNTRY_REGULATORY_INFO: Record<string, { framework: string, trackerRule: string, consent: string, footer: string }> = {
  "FR": {
    framework: "GDPR / CNIL (Commission Nationale de l'Informatique et des Libertés) 2026",
    trackerRule: "Tracking pixels require prior active consent. Silent or invisible tracking is strictly prohibited and must be removed.",
    consent: "Double opt-in or active consent registry required. Self-registration must be log-provable.",
    footer: "Corporate registration number, physical HQ address, easy one-click unsubscription, and link to CNIL Privacy Rights."
  },
  "DE": {
    framework: "GDPR / UWG (Gesetz gegen den unlauteren Wettbewerb) 2026",
    trackerRule: "Extremely strict. Silent open tracking violates TDDDG. Opt-in is mandatory before pixel tracking can fire.",
    consent: "Double Opt-In (DOI) with explicit confirmation timestamp is mandatory for unsolicited B2C & B2B emails.",
    footer: "Comprehensive corporate Impressum (registered seat, court register number, directors, contact details) and immediate unsubscription link."
  },
  "US-CA": {
    framework: "CCPA / CPRA (California Consumer Privacy Act / Rights Act) 2026",
    trackerRule: "Consumer must be notified of tracking. Clear options to opt-out of sharing or profiling.",
    consent: "Opt-out model, but must explicitly disclose if data is sold or shared with affiliates or third parties.",
    footer: "Mandatory 'Do Not Sell or Share My Personal Information' and 'Limit the Use of My Sensitive Personal Information' visual links."
  },
  "IT": {
    framework: "GDPR / Garante per la protezione dei dati personali 2026",
    trackerRule: "Silent read receipts and telemetry pixels are forbidden. All trackers must be paused until explicit opt-in.",
    consent: "Pre-checked consent boxes are invalid. Active opt-in is required before subscribing.",
    footer: "Sender name, full corporate identification, physical address, and detailed cookie/privacy policy link."
  },
  "JP": {
    framework: "APPI (Act on the Protection of Personal Information) 2026",
    trackerRule: "Usage of tracking tools must be declared in the Privacy Policy. Opt-out route must be available.",
    consent: "Purpose of use must be clearly defined and declared. Prior consent needed for third-party transfers.",
    footer: "Identity of business operator, direct inquiry point/desk, clear details for opt-out of future mailings."
  }
};
