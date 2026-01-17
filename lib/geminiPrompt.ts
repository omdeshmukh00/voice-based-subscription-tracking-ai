export const EXPENSE_EXTRACTION_PROMPT = `
You are an AI system that analyzes emails.

TASK:
1. First decide whether the email is related to a subscription, bill, or payment.
2. If it is NOT related, return ONLY this JSON:
{
  "is_relevant": false
}

3. If it IS related, return ONLY valid JSON with the following fields:
{
  "is_relevant": true,
  "service_name": string | null,
  "amount": number | null,
  "currency": string | null,
  "billing_cycle": "monthly" | "yearly" | "one-time" | "unknown",
  "category": "subscription" | "utility" | "shopping" | "other"
}

RULES:
- Return ONLY JSON
- No explanations
- No markdown
- Use null if information is missing
`;
