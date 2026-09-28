import { eq } from 'drizzle-orm';
import type {} from '@netlify/functions';
import { db } from '../../db/index.js';
import { siteConfig } from '../../db/schema.js';
import {
  generateAdminToken,
  hashPassword,
  hashToken,
  verifyPassword,
} from './_utils/auth.js';
import { errorJson, json } from './_utils/api.js';

const SETUP_KEY = 'admin_password_hash';
const SESSION_KEY = 'admin_session';
const SESSION_COOKIE = 'nw_admin_session';

const TABLE_MISSING = '42P01';

async function ensureSchema(): Promise<void> {
  await db.execute(
    `CREATE TABLE IF NOT EXISTS "site_config" (
      "id" serial PRIMARY KEY,
      "key" text NOT NULL UNIQUE,
      "value" jsonb NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    )`,
  );
}

function readSessionCookie(req: Request): string | null {
  const cookie = req.headers.get('cookie') ?? '';
  const match = cookie.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return match ? match[1] : null;
}

export default async (req: Request) => {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  if (req.method === 'GET' && action === 'status') {
    let configured = Boolean(Netlify.env.get('ADMIN_PASSWORD'));
    try {
      const rows = await db.select().from(siteConfig).where(eq(siteConfig.key, SETUP_KEY)).limit(1);
      configured = configured || rows.length > 0;
    } catch (e) {
      if ((e as { code?: string }).code === TABLE_MISSING) {
        await ensureSchema();
      } else {
        return errorJson('Database belum siap. Coba beberapa saat lagi.', 503);
      }
    }
    return json({ configured });
  }

  if (req.method === 'POST' && action === 'setup') {
    let setupAlreadyDone = false;
    try {
      const rows = await db.select().from(siteConfig).where(eq(siteConfig.key, SETUP_KEY)).limit(1);
      setupAlreadyDone = rows.length > 0;
    } catch (e) {
      if ((e as { code?: string }).code === TABLE_MISSING) {
        await ensureSchema();
      } else {
        return errorJson('Database belum siap. Coba beberapa saat lagi.', 503);
      }
    }
    if (setupAlreadyDone || Netlify.env.get('ADMIN_PASSWORD')) {
      return errorJson('Admin sudah dikonfigurasi. Gunakan login.', 409);
    }
    const body = await req.json().catch(() => null);
    const password = body?.password;
    if (typeof password !== 'string' || password.length < 8) {
      return errorJson('Password minimal 8 karakter.', 400);
    }
    await db
      .insert(siteConfig)
      .values({ key: SETUP_KEY, value: hashPassword(password) })
      .onConflictDoNothing({ target: siteConfig.key });
    return json({ ok: true });
  }

  if (req.method === 'POST' && action === 'login') {
    const body = await req.json().catch(() => null);
    const password = body?.password;
    if (typeof password !== 'string' || !password) {
      return errorJson('Password wajib diisi.', 400);
    }
    const envPassword = Netlify.env.get('ADMIN_PASSWORD');
    let storedHash: unknown;
    try {
      const rows = await db.select().from(siteConfig).where(eq(siteConfig.key, SETUP_KEY)).limit(1);
      storedHash = rows[0]?.value;
    } catch {
      // Database not ready — fall back to the environment password if present.
    }

    let valid = false;
    if (typeof storedHash === 'string' && storedHash.includes(':')) {
      valid = verifyPassword(password, storedHash);
    } else if (envPassword) {
      valid = password === envPassword;
    } else {
      return errorJson('Admin belum dikonfigurasi. Buka /admin untuk setup pertama.', 409);
    }

    if (!valid) {
      return errorJson('Password salah.', 401);
    }

    const token = generateAdminToken();
    const tokenHash = hashToken(token);
    try {
      await db
        .insert(siteConfig)
        .values({ key: `${SESSION_KEY}:${tokenHash}`, value: { created: Date.now() } })
        .onConflictDoNothing();
    } catch {
      // Database unavailable — the session cookie still works for this invocation scope.
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        'Set-Cookie': `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`,
      },
    });
  }

  if (req.method === 'POST' && action === 'logout') {
    const token = readSessionCookie(req);
    if (token) {
      const tokenHash = hashToken(token);
      await db.delete(siteConfig).where(eq(siteConfig.key, `${SESSION_KEY}:${tokenHash}`));
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
      },
    });
  }

  if (req.method === 'GET' && action === 'me') {
    const token = readSessionCookie(req);
    if (!token) return json({ authenticated: false });
    const tokenHash = hashToken(token);
    const rows = await db
      .select()
      .from(siteConfig)
      .where(eq(siteConfig.key, `${SESSION_KEY}:${tokenHash}`))
      .limit(1);
    return json({ authenticated: rows.length > 0 });
  }

  return errorJson('Method atau action tidak dikenal.', 405);
};
