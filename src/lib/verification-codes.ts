// Shared in-memory store for verification codes
// In production, use Redis or a proper database
export const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function cleanupExpiredCodes() {
  const now = Date.now();
  for (const [email, data] of verificationCodes.entries()) {
    if (now > data.expiresAt) {
      verificationCodes.delete(email);
    }
  }
}
