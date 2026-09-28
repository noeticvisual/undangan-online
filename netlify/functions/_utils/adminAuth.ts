import { eq } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { siteConfig } from '../../../db/schema.js';
import { hashToken } from './auth.js';

const SESSION_KEY = 'admin_session';
const SESSION_COOKIE = 'nw_admin_session';

export async function getAdminSession(req: Request): Promise<{ key: string } | null> {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  if (!match) return null;
  const tokenHash = hashToken(match[1]);
  const key = `${SESSION_KEY}:${tokenHash}`;
  const rows = await db.select().from(siteConfig).where(eq(siteConfig.key, key)).limit(1);
  if (rows.length === 0) return null;
  return { key };
}
