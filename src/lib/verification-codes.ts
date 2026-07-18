import { query } from '@/lib/db';

type VerificationCodePayload = {
  code: string;
  expiresAt: number;
};

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const verificationCodes = {
  async set(email: string, data: VerificationCodePayload, userId?: number | null): Promise<void> {
    const normalizedEmail = normalizeEmail(email);
    const expiresAtDate = new Date(data.expiresAt);
    
    // Validate the expires_at timestamp
    if (!Number.isFinite(data.expiresAt) || data.expiresAt <= Date.now()) {
      throw new Error('Invalid expiration time');
    }

    // Replace any existing code for this email with delete + insert instead of
    // `ON CONFLICT (email)`. ON CONFLICT requires a unique index whose columns exactly
    // match the conflict target; a database provisioned from a schema that indexes
    // LOWER(email) (or lacks the constraint entirely) makes `ON CONFLICT (email)` throw
    // "there is no unique or exclusion constraint matching the ON CONFLICT specification".
    // Delete + insert works regardless of which index the deployed database has.
    await query('DELETE FROM password_reset_tokens WHERE LOWER(email) = $1', [normalizedEmail]);
    await query(
      `INSERT INTO password_reset_tokens (user_id, email, code, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [userId ?? null, normalizedEmail, data.code, expiresAtDate.toISOString()],
    );
  },

  async get(email: string): Promise<VerificationCodePayload | null> {
    const normalizedEmail = normalizeEmail(email);
    const result = await query(
      `SELECT code, expires_at
         FROM password_reset_tokens
        WHERE LOWER(email) = $1
          AND expires_at > NOW()
        ORDER BY expires_at DESC
        LIMIT 1`,
      [normalizedEmail],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as { code: string; expires_at: string | Date };
    const expiresAtMs = new Date(row.expires_at).getTime();

    // Double-check expiration in case of clock skew
    if (!Number.isFinite(expiresAtMs) || expiresAtMs <= Date.now()) {
      await query('DELETE FROM password_reset_tokens WHERE LOWER(email) = $1', [normalizedEmail]);
      return null;
    }

    return { code: row.code, expiresAt: expiresAtMs };
  },

  async delete(email: string): Promise<void> {
    const normalizedEmail = normalizeEmail(email);
    await query('DELETE FROM password_reset_tokens WHERE LOWER(email) = $1', [normalizedEmail]);
  },
};

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function cleanupExpiredCodes(): Promise<void> {
  await query('DELETE FROM password_reset_tokens WHERE expires_at < NOW()');
}
