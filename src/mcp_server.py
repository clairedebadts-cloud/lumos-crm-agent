import os
import json
import asyncio

MOCK_DATA_WAREHOUSE = {
    "u101": {
        "segment": "US_Clinicians", 
        "status": "active_trial", 
        "days_since_signup": 6, 
        "masked_email": "c*******@gmail.com",
        "has_payment_method": False
    },
    "u102": {
        "segment": "US_Clinicians", 
        "status": "churn_risk", 
        "days_since_signup": 28, 
        "masked_email": "t*******@outlook.com",
        "has_payment_method": False
    },
    "u103": {
        "segment": "EU_Enterprise", 
        "status": "premium_subscriber", 
        "days_since_signup": 94, 
        "masked_email": "m*******@company.de",
        "has_payment_method": True
    }
}

class CRMGuardrailAgent:
    """
    Implements Andrew Ng's Iterative Agentic Workflow:
    1. Research Question: Can we evaluate copy contextualized by live data records?
    2. Error Validation: Programmatically trap syntax and logic errors.
    3. Guardrail Definition: Enforce hard constraints before deployment.
    """
    def __init__(self, data_warehouse: dict):
        self.db = data_warehouse

    async def run_validation_pipeline(self, user_id: str, campaign_type: str, email_copy: str) -> dict:
        # 1. Context Retrieval (Research Baseline)
        user_profile = self.db.get(user_id)
        if not user_profile:
            return {"status": "ERROR", "reason": f"User {user_id} not found."}

        # 2. Structural Guardrail Check (Phase 2: Error Validation)
        # Catches syntax breaks and unrendered tags before spending LLM tokens
        if "{{" in email_copy or "}}" in email_copy:
            return {
                "status": "BLOCKED",
                "flag": "STRUCTURE_VIOLATION",
                "reason": "Unparsed template tags detected in outgoing string.",
                "user_context": user_profile
            }
        
        if "TODO" in email_copy or "FIXME" in email_copy:
            return {
                "status": "BLOCKED",
                "flag": "STRUCTURE_VIOLATION",
                "reason": "Internal developer placeholders left in marketing copy.",
                "user_context": user_profile
            }

        # 3. Business Logic Guardrail Check (Phase 3: Guardrail Definition)
        # Prevents sending trial warnings or upgrade scripts to premium accounts
        if user_profile["status"] == "premium_subscriber" and "trial_expiration" in campaign_type:
            return {
                "status": "BLOCKED",
                "flag": "LIFECYCLE_COLLISION",
                "reason": f"Critical Conflict: Aggressive campaign type '{campaign_type}' targeted at an active paying premium subscriber.",
                "user_context": user_profile
            }

        # If all validation iterations pass cleanly
        return {
            "status": "APPROVED",
            "flag": "NONE",
            "reason": "Campaign text safely aligned with user lifecycle and syntax standards.",
            "user_context": user_profile
        }

# --- Demonstration Trigger ---
async def main():
    agent = CRMGuardrailAgent(MOCK_DATA_WAREHOUSE)
    
    print("🚀 Running Andrew Ng Iterative Error Validation Loop...\n")
    
    # Test Case 1: Accidentally targeting premium subscriber 'u103' with a trial warning campaign
    print("--- Test Case: Lifecycle Collision ---")
    result_collision = await agent.run_validation_pipeline(
        user_id="u103",
        campaign_type="trial_expiration_warning",
        email_copy="Your access is expiring! Upgrade your workspace dashboard now."
    )
    print(json.dumps(result_collision, indent=2))
    print("\n" + "="*50 + "\n")

    # Test Case 2: Broken markdown template containing unrendered code blocks
    print("--- Test Case: Structural Syntax Leak ---")
    result_syntax = await agent.run_validation_pipeline(
        user_id="u101",
        campaign_type="re_engagement_blast",
        email_copy="Hey {{user.first_name}}, check out our new update! TODO: verify link."
    )
    print(json.dumps(result_syntax, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
