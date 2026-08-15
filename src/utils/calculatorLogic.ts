/**
 * Calculator Logic Engine with high precision and robust error handling.
 */

export interface EvaluationResult {
  success: boolean;
  result: string;
  error?: string;
}

export function sanitizeExpression(expr: string): string {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/\s+/g, '');
}

export function evaluateExpression(expression: string, isArabic = true): EvaluationResult {
  const sanitized = sanitizeExpression(expression);
  if (!sanitized) {
    return { success: true, result: '0' };
  }

  // Check for division by zero upfront
  if (/\/0(?![.0-9])/.test(sanitized) || /\/0\.0+(?![1-9])/.test(sanitized)) {
    return {
      success: false,
      result: '0',
      error: isArabic ? 'لا يمكن القسمة على الصفر' : 'Cannot divide by 0',
    };
  }

  try {
    // Replace % operator: e.g. 50% -> (50/100), or A + B% -> A + (A * B / 100)
    let processed = sanitized.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    
    // Replace constants
    processed = processed.replace(/π/g, `${Math.PI}`);
    processed = processed.replace(/e/g, `${Math.E}`);
    
    // Handle scientific functions if any
    processed = processed.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1) * Math.PI / 180)');
    processed = processed.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1) * Math.PI / 180)');
    processed = processed.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1) * Math.PI / 180)');
    processed = processed.replace(/√\(([^)]+)\)/g, 'Math.sqrt($1)');
    processed = processed.replace(/ln\(([^)]+)\)/g, 'Math.log($1)');
    processed = processed.replace(/log\(([^)]+)\)/g, 'Math.log10($1)');
    processed = processed.replace(/\^/g, '**');

    // Only allow safe math tokens
    if (!/^[0-9+\-*/().MathPIE_ **]+$/.test(processed)) {
      return {
        success: false,
        result: '0',
        error: isArabic ? 'خطأ في التعبير الرياضي' : 'Invalid expression',
      };
    }

    // Evaluate safely
    // eslint-disable-next-line no-new-func
    const val = Function(`"use strict"; return (${processed});`)();

    if (typeof val !== 'number' || isNaN(val)) {
      return {
        success: false,
        result: '0',
        error: isArabic ? 'خطأ حسابي' : 'Calculation error',
      };
    }

    if (!isFinite(val)) {
      return {
        success: false,
        result: '0',
        error: isArabic ? 'لا يمكن القسمة على الصفر' : 'Cannot divide by 0',
      };
    }

    // Format number to prevent float inaccuracies like 0.1 + 0.2 = 0.30000000000000004
    const rounded = Number(Math.round(Number(val + 'e+10')) + 'e-10');
    const resultStr = rounded.toString();

    return {
      success: true,
      result: resultStr,
    };
  } catch {
    return {
      success: false,
      result: '0',
      error: isArabic ? 'تعبير غير مكتمل' : 'Incomplete expression',
    };
  }
}

export function formatNumberWithCommas(numStr: string): string {
  if (!numStr || isNaN(Number(numStr))) return numStr;
  const parts = numStr.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}
