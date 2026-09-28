import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

export function hashPassword(password: string, salt?: string): string {
  const s = salt ?? randomBytes(16).toString('hex');
  const hash = scryptSync(password, s, 64).toString('hex');
  return `${s}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

export function generateAdminToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashToken(token: string): string {
  return createHmac('sha256', 'niskala-admin-session').update(token).digest('hex');
}

export interface SessionClaims {
  sub: string;
  exp: number;
}

export function createSessionToken(tokenHash: string): string {
  const claims: SessionClaims = {
    sub: tokenHash,
    exp: Date.now() + SESSION_TTL_MS,
  };
  return b64url(JSON.stringify(claims));
}

export function parseSessionToken(value: string | undefined | null): SessionClaims | null {
  if (!value) return null;
  try {
    const claims = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as SessionClaims;
    if (!claims?.sub || typeof claims.exp !== 'number') return null;
    if (claims.exp < Date.now()) return null;
    return claims;
  } catch {
    return null;
  }
}

export function slugifyName(name: string): string {
  const base = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  const suffix = randomBytes(4).toString('hex');
  return `${base || 'tamu'}-${suffix}`;
}
