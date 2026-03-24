
// Environment variables utility

const toStringOrUndefined = (value: unknown) =>
  typeof value === 'string' && value.length > 0 ? value : undefined;

export const env = {
  API_URL: toStringOrUndefined(import.meta.env.VITE_API_URL) ?? '',
  DEFAULT_LANGUAGE: (import.meta.env.VITE_DEFAULT_LANGUAGE as 'pt' | 'en') || 'pt',
  FRONTEND_URL: toStringOrUndefined(import.meta.env.VITE_FRONTEND_URL),
  EMAIL_VERIFICATION_REDIRECT_URL: toStringOrUndefined(
    import.meta.env.VITE_EMAIL_VERIFICATION_REDIRECT_URL
  ),
};

/**
 * Validates that all required environment variables are set
 * @returns boolean indicating if all required environment variables are set
 */
export const validateEnv = (): boolean => {
  const requiredVars = ['API_URL'];

  const missingVars = requiredVars.filter(
    (varName) => !env[varName as keyof typeof env]
  );

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
    return false;
  }

  return true;
};
