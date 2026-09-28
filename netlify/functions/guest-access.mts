import { and, desc, eq, ne, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { guests, rsvps } from '../../db/schema.js';
import { getAdminSession } from './_utils/adminAuth.js';
import { errorJson, json } from './_utils/api.js';

export default async (req: Request) => {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    if (!slug) return errorJson('Parameter slug wajib ada.', 400);

    const rows = await db.select().from(guests).where(eq(guests.slug, slug)).limit(1);
    if (rows.length === 0) return errorJson('Tamu tidak ditemukan.', 404);
    const guest = rows[0];

    const existing = await db
      .select()
      .from(rsvps)
      .where(and(eq(rsvps.guestSlug, slug), ne(rsvps.attendance, 'deleted')))
      .orderBy(desc(rsvps.createdAt))
      .limit(1);

    return json({
      guest: {
        name: guest.name,
        slug: guest.slug,
        note: guest.note,
        category: guest.category,
        invitationCount: guest.invitationCount,
        maxSurat: guest.maxSurat,
        isOpen: guest.isOpen,
      },
      alreadyResponded: existing.length > 0,
      response: existing[0] ?? null,
    });
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null);
    const slug = typeof body?.guestSlug === 'string' ? body.guestSlug.slice(0, 160) : '';
    if (!slug) return errorJson('Link undangan tidak valid.', 400);

    const rows = await db.select().from(guests).where(eq(guests.slug, slug)).limit(1);
    if (rows.length === 0) return errorJson('Tamu tidak ditemukan.', 404);

    await db
      .update(guests)
      .set({ isOpen: true, openedAt: sql`COALESCE(${guests.openedAt}, NOW())` })
      .where(eq(guests.slug, slug));

    return json({ ok: true });
  }

  return errorJson('Method tidak didukung.', 405);
};
