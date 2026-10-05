/**
 * Server-side & Edge runtime API key resolver for AI Story & Illustration generation.
 * All keys must be securely configured via environment variables (.env.local / hosting provider).
 */

export function getOpenAiApiKey(): string {
  const envKey = process.env.OPENAI_API_KEY?.trim();
  if (envKey && envKey.startsWith('sk-')) {
    return envKey;
  }
  return '';
}

export function getGeminiApiKey(): string {
  const envKey = process.env.GEMINI_API_KEY?.trim();
  if (envKey && envKey.length > 10) {
    return envKey;
  }
  return '';
}
