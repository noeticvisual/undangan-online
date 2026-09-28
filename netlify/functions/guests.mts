import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { guests, rsvps } from '../../db/schema.js';
import { getAdminSession } from './_utils/adminAuth.js';
import { slugifyName } from './_utils/auth.js';
import { errorJson, json } from './_utils/api.js';

interface GuestPayload {
  name?: unknown;
  note?: unknown;
  category?: unknown;
  invitationCount?: unknown;
  maxSurat?: unknown;
}

function sanitize(body: GuestPayload) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 120) return null;
  return {
    name,
    note: typeof body.note === 'string' ? body.note.slice(0, 300) : '',
    category: typeof body.category === 'string' && body.category.trim() ? body.category.trim().slice(0, 40) : 'tamu',
    invitationCount: Number.isInteger(body.invitationCount) && (body.invitationCount as number) > 0 ? (body.invitationCount as number) : 1,
    maxSurat: Number.isInteger(body.maxSurat) && (body.maxSurat as number) > 0 ? (body.maxSurat as number) : 1,
  };
}

export default async (req: Request) => {
  const session = await getAdminSession(req);

  // Public endpoint: resolve guest by slug (used by client invitation links)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');
    if (slug) {
      const rows = await db.select().from(guests).where(eq(guests.slug, slug)).limit(1);
      if (rows.length === 0) return errorJson('Tamu tidak ditemukan.', 404);
      const guest = rows[0];
      return json({
        guest: {
          name: guest.name,
          slug: guest.slug,
          note: guest.note,
          category: guest.category,
          invitationCount: guest.invitationCount,
          maxSurat: guest.maxSurat,
        },
      });
    }

    if (!session) return errorJson('Tidak memiliki akses admin.', 401);
    const all = await db.select().from(guests).orderBy(desc(guests.createdAt));
    return json({ guests: all });
  }

  if (!session) return errorJson('Tidak memiliki akses admin.', 401);

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null);
    const data = sanitize(body ?? {});
    if (!data) return errorJson('Nama tamu wajib diisi (maks 120 karakter).', 400);
    const [created] = await db
      .insert(guests)
      .values({ ...data, slug: slugifyName(data.name) })
      .returning();
    return json({ guest: created }, 201);
  }

  const slug = new URL(req.url).searchParams.get('slug');
  if (!slug) return errorJson('Parameter slug wajib ada.', 400);

  if (req.method === 'PUT') {
    const body = await req.json().catch(() => null);
    const data = sanitize(body ?? {});
    if (!data) return errorJson('Nama tamu wajib diisi (maks 120 karakter).', 400);
    const [updated] = await db.update(guests).set(data).where(eq(guests.slug, slug)).returning();
    if (!updated) return errorJson('Tamu tidak ditemukan.', 404);
    return json({ guest: updated });
  }

  if (req.method === 'DELETE') {
    const [deleted] = await db.delete(guests).where(eq(guests.slug, slug)).returning();
    if (!deleted) return errorJson('Tamu tidak ditemukan.', 404);
    await db.delete(rsvps).where(eq(rsvps.guestSlug, slug));
    return json({ ok: true });
  }

  return errorJson('Method tidak didukung.', 405);
};
