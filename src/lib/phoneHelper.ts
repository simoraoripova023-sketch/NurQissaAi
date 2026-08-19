/**
 * Helper utilities for strictly formatting and validating 9-digit Uzbekistan phone numbers.
 * Ex: +998 (90) 123-45-67 (maximum 9 digits)
 */

export function cleanUzbekPhoneDigits(input: string): string {
  if (!input) return '';
  
  // Strip all non-digit characters
  let digits = input.replace(/\D/g, '');

  // If user pasted full international number with 998 (e.g. 998901234567 -> 12 digits), strip the 998 prefix
  if (digits.startsWith('998') && digits.length > 9) {
    digits = digits.slice(3);
  }

  // Strictly enforce maximum 9 digits
  return digits.slice(0, 9);
}

export function formatUzbekPhoneDisplay(digitsOnly: string): string {
  const digits = cleanUzbekPhoneDigits(digitsOnly);
  if (!digits) return '';

  if (digits.length <= 2) {
    return `(${digits}`;
  }
  if (digits.length <= 5) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7, 9)}`;
}

export function isUzbekPhoneValid(digitsOnly: string): boolean {
  const digits = cleanUzbekPhoneDigits(digitsOnly);
  return digits.length === 9;
}
