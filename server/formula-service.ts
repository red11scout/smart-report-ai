/**
 * Formula evaluation service for calculated fields.
 * Provides safe expression parsing and evaluation for the formula editor.
 */

// Available inputs that can be used in formulas
export const AVAILABLE_INPUTS: Record<string, { label: string; category: string; unit: string; description: string }> = {
  // Revenue inputs
  revenueBenefit: { label: "Revenue Benefit", category: "Benefits", unit: "$", description: "Annual revenue benefit from use case" },
  costBenefit: { label: "Cost Benefit", category: "Benefits", unit: "$", description: "Annual cost savings from use case" },
  cashFlowBenefit: { label: "Cash Flow Benefit", category: "Benefits", unit: "$", description: "Annual cash flow improvement" },
  riskBenefit: { label: "Risk Benefit", category: "Benefits", unit: "$", description: "Annual risk reduction value" },
  totalAnnualImpact: { label: "Total Annual Impact", category: "Benefits", unit: "$", description: "Sum of all benefit categories" },
  probabilityOfSuccess: { label: "Probability of Success", category: "Benefits", unit: "%", description: "Likelihood of achieving projected benefits" },

  // Scoring inputs
  valueScore: { label: "Value Score", category: "Scoring", unit: "pts", description: "Normalized value score (0-100)" },
  ttvScore: { label: "TTV Score", category: "Scoring", unit: "pts", description: "Time-to-value score (0-100)" },
  effortScore: { label: "Effort Score", category: "Scoring", unit: "pts", description: "Implementation effort score (1-5)" },
  weightValue: { label: "Value Weight", category: "Scoring", unit: "%", description: "Weight for value in priority calculation" },
  weightTtv: { label: "TTV Weight", category: "Scoring", unit: "%", description: "Weight for time-to-value in priority calculation" },
  weightEffort: { label: "Effort Weight", category: "Scoring", unit: "%", description: "Weight for effort in priority calculation" },
  maxTotalImpact: { label: "Max Total Impact", category: "Scoring", unit: "$", description: "Maximum total impact across all use cases" },

  // Token inputs
  avgInputTokens: { label: "Avg Input Tokens", category: "Token Modeling", unit: "tokens", description: "Average input tokens per run" },
  avgOutputTokens: { label: "Avg Output Tokens", category: "Token Modeling", unit: "tokens", description: "Average output tokens per run" },
  inputTokenCost: { label: "Input Token Cost", category: "Token Modeling", unit: "$/1M", description: "Cost per million input tokens" },
  outputTokenCost: { label: "Output Token Cost", category: "Token Modeling", unit: "$/1M", description: "Cost per million output tokens" },
  runsPerYear: { label: "Runs Per Year", category: "Token Modeling", unit: "runs", description: "Number of runs per year" },
  cachingEffectiveness: { label: "Caching Effectiveness", category: "Token Modeling", unit: "%", description: "Percentage of requests that hit cache" },
  promptCachingDiscount: { label: "Prompt Caching Discount", category: "Token Modeling", unit: "%", description: "Discount rate for cached prompts" },

  // Time inputs
  timeToValueMonths: { label: "Time to Value", category: "Implementation", unit: "months", description: "Months to achieve projected value" },
  implementationCost: { label: "Implementation Cost", category: "Implementation", unit: "$", description: "One-time implementation cost" },
  annualTokenCost: { label: "Annual Token Cost", category: "Implementation", unit: "$", description: "Annual AI token costs" },
};

/**
 * Group available inputs by category
 */
export function getInputsByCategory(): Record<string, typeof AVAILABLE_INPUTS> {
  const grouped: Record<string, typeof AVAILABLE_INPUTS> = {};

  for (const [key, input] of Object.entries(AVAILABLE_INPUTS)) {
    if (!grouped[input.category]) {
      grouped[input.category] = {};
    }
    grouped[input.category][key] = input;
  }

  return grouped;
}

/**
 * Validate a formula expression
 */
export function validateFormula(
  expression: string,
  allowedVariables: string[]
): { isValid: boolean; errors: string[]; missingVariables: string[]; usedVariables: string[] } {
  const errors: string[] = [];
  const missingVariables: string[] = [];
  const usedVariables: string[] = [];

  if (!expression || !expression.trim()) {
    return { isValid: false, errors: ["Expression is empty"], missingVariables: [], usedVariables: [] };
  }

  // Extract variable names from expression (word characters not preceded/followed by quotes)
  const variablePattern = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
  const builtinFunctions = new Set(["max", "min", "abs", "floor", "ceil", "round", "sqrt", "pow", "log"]);
  let match;

  while ((match = variablePattern.exec(expression)) !== null) {
    const name = match[1];
    if (builtinFunctions.has(name)) continue;
    if (!usedVariables.includes(name)) {
      usedVariables.push(name);
    }
    if (!allowedVariables.includes(name)) {
      if (!missingVariables.includes(name)) {
        missingVariables.push(name);
      }
    }
  }

  if (missingVariables.length > 0) {
    errors.push(`Unknown variables: ${missingVariables.join(", ")}`);
  }

  // Check for balanced parentheses
  let depth = 0;
  for (const ch of expression) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth < 0) {
      errors.push("Unbalanced parentheses");
      break;
    }
  }
  if (depth !== 0 && !errors.includes("Unbalanced parentheses")) {
    errors.push("Unbalanced parentheses");
  }

  return {
    isValid: errors.length === 0,
    errors,
    missingVariables,
    usedVariables,
  };
}

/**
 * Safely evaluate a formula expression with given context
 */
function safeEvaluate(
  expression: string,
  context: Record<string, number>
): { value: number; error?: string } {
  try {
    // Replace variable names with their values
    let evalExpr = expression;

    // Sort by length descending to avoid partial replacements
    const sortedKeys = Object.keys(context).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const regex = new RegExp(`\\b${key}\\b`, "g");
      evalExpr = evalExpr.replace(regex, String(context[key] ?? 0));
    }

    // Replace builtin functions with Math equivalents
    evalExpr = evalExpr
      .replace(/\bmax\b/g, "Math.max")
      .replace(/\bmin\b/g, "Math.min")
      .replace(/\babs\b/g, "Math.abs")
      .replace(/\bfloor\b/g, "Math.floor")
      .replace(/\bceil\b/g, "Math.ceil")
      .replace(/\bround\b/g, "Math.round")
      .replace(/\bsqrt\b/g, "Math.sqrt")
      .replace(/\bpow\b/g, "Math.pow")
      .replace(/\blog\b/g, "Math.log");

    // Only allow safe characters
    if (!/^[\d\s+\-*/().,%Math.maxinfloorceisqrtpowlog]+$/.test(evalExpr.replace(/Math\.\w+/g, ""))) {
      return { value: 0, error: "Expression contains invalid characters" };
    }

    // Use Function constructor for evaluation (safer than eval)
    const fn = new Function(`"use strict"; return (${evalExpr});`);
    const result = fn();

    if (typeof result !== "number" || !isFinite(result)) {
      return { value: 0, error: "Expression did not evaluate to a finite number" };
    }

    return { value: result };
  } catch (err: any) {
    return { value: 0, error: err.message || "Evaluation failed" };
  }
}

/**
 * Preview formula evaluation without saving
 */
export function previewFormula(
  expression: string,
  context: Record<string, number>,
  constants: Array<{ key: string; value: number }>
): { value: number; error?: string; usedVariables: string[] } {
  // Merge constants into context
  const fullContext = { ...context };
  for (const c of constants) {
    fullContext[c.key] = c.value;
  }

  const allVars = Object.keys(fullContext);
  const validation = validateFormula(expression, allVars);

  if (!validation.isValid) {
    return { value: 0, error: validation.errors.join("; "), usedVariables: validation.usedVariables };
  }

  const result = safeEvaluate(expression, fullContext);
  return { ...result, usedVariables: validation.usedVariables };
}

/**
 * Evaluate a formula with given context and constants
 */
export function evaluateFormula(
  expression: string,
  context: Record<string, number>,
  constants: Array<{ key: string; value: number }>
): { value: number; error?: string } {
  const fullContext = { ...context };
  for (const c of constants) {
    fullContext[c.key] = c.value;
  }

  return safeEvaluate(expression, fullContext);
}
