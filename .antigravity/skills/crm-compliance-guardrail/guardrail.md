# CRM Guardrail Definition

## 🔎 Phase 1: Core Research Question
- **Baseline Objective:** Can an AI agent cross-reference a user's subscription state with an outbound marketing campaign payload to prevent churn risks and bad syntax deployment?

## 🛑 Phase 2: Error Validation Modes
The agent must catch and flag two critical failure modes:
1. **LIFECYCLE_COLLISION:** Preventing active `premium_subscriber` accounts from being treated as trials.
2. **STRUCTURE_VIOLATION:** Catching unrendered bracket syntax like `{{...}}` or internal developer notes like `TODO`.

## 🛡️ Phase 3: Final Guardrail Constraints
Execute all reviews against the incoming code context using these hard constraints:
- If `status == "premium_subscriber"` AND `campaign_type == "trial_expiration_warning"` -> Stop, output **STATUS: BLOCKED**, Reason: `LIFECYCLE_COLLISION`.
- If `email_copy` contains `{{` or `}}` or `TODO` -> Stop, output **STATUS: BLOCKED**, Reason: `STRUCTURE_VIOLATION`.
- If all checks pass -> Output **STATUS: APPROVED**.