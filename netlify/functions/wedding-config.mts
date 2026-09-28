import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { siteConfig } from '../../db/schema.js';
import { getAdminSession } from './_utils/adminAuth.js';
import { CONFIG_KEY, errorJson, json, normalizeConfig } from './_utils/api.js';

export default async (req: Request) => {
  if (req.method === 'GET') {
    const rows = await db.select().from(siteConfig).where(eq(siteConfig.key, CONFIG_KEY)).limit(1);
    return json({ config: rows[0]?.value ?? null });
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    const session = await getAdminSession(req);
    if (!session) return errorJson('Tidak memiliki akses admin.', 401);

    const body = await req.json().catch(() => null);
    const config = normalizeConfig(body?.config);
    if (!config) return errorJson('Format data undangan tidak valid.', 400);

    await db
      .insert(siteConfig)
      .values({ key: CONFIG_KEY, value: config, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteConfig.key,
        set: { value: config, updatedAt: new Date() },
      });

    return json({ ok: true, config });
  }

  return errorJson('Method tidak didukung.', 405);
};
