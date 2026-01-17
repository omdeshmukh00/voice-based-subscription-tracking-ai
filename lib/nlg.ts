export function generateNaturalResponse(sub: any): string {
  const { service_name, amount, currency, billing_cycle } = sub;

  if (!service_name) {
    return "You have a subscription, but some details are missing.";
  }

  let priceText = "with no charge information";
  if (amount && currency) {
    const symbol = currency === "INR" ? "₹" : "$";
    priceText = `that costs ${symbol}${amount}`;
  }

  let cycleText = "";
  if (billing_cycle && billing_cycle !== "unknown") {
    cycleText = ` per ${billing_cycle}`;
  }

  return `You have an active ${service_name} subscription ${priceText}${cycleText}.`;
}
