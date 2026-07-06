export interface CustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  campaignSubject: string;
  campaignBody: string;
}

export interface CustomInstructions {
  sanitization: string;
  compliance: string;
  accessibility: string;
  compiler: string;
}

export interface SanitizationResult {
  reasoning: string;
  originalName?: string;
  repairedName: string;
  greetingFallbackUsed: string;
  changedFields?: string[];
}

export interface RegulatoryResult {
  reasoning: string;
  targetMarketName: string;
  frameworks2026: string[];
  trackingPixelAction: string;
  consentRequirements: string;
  footerAdditions?: string[];
}

export interface CtaTransformation {
  before: string;
  after: string;
  explanation?: string;
}

export interface AccessibilityResult {
  reasoning: string;
  langTagApplied: string;
  contrastRating: string;
  ctaTransformations: CtaTransformation[];
}

export interface CompilerResult {
  reasoning: string;
  compiledHtml: string;
  visualHighlights?: string[];
}

export interface AuditScorecard {
  initialComplianceScore: number;
  finalComplianceScore: number;
  issuesFixed: string[];
  accessibilityPass: boolean;
}

export interface SandboxResponse {
  sanitizationNode: SanitizationResult;
  regulatoryAnalystNode: RegulatoryResult;
  accessibilityAuditorNode: AccessibilityResult;
  htmlCompilerNode: CompilerResult;
  rawMarkdownReasoning: string;
  scorecard: AuditScorecard;
}

export interface PresetScenario {
  id: string;
  title: string;
  countryName: string;
  countryCode: string;
  description: string;
  icon: string;
  payload: CustomerPayload;
}
