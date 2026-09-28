import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { guests, rsvps } from '../../db/schema.js';
import { getAdminSession } from './_utils/adminAuth.js';
import { errorJson, json } from './_utils/api.js';

export default async (req: Request) => {
  if (req.method === 'GET') {
    const session = await getAdminSession(req);
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug');

    if (!session) {
      // Public wishing board: names + messages only
      const all = await db.select().from(rsvps).orderBy(desc(rsvps.createdAt)).limit(200);
      return json({
        rsvps: all.map((r) => ({
          id: r.id,
          guestName: r.guestName,
          attendance: r.attendance,
          guestCount: r.guestCount,
          message: r.message,
          createdAt: r.createdAt,
        })),
      });
    }

    const rows = slug
      ? await db.select().from(rsvps).where(eq(rsvps.guestSlug, slug)).orderBy(desc(rsvps.createdAt))
      : await db.select().from(rsvps).orderBy(desc(rsvps.createdAt));
    return json({ rsvps: rows });
  }

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null);
    const guestName = typeof body?.guestName === 'string' ? body.guestName.trim().slice(0, 120) : '';
    const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 1000) : '';
    const attendance = ['hadir', 'tidak_hadir', 'ragu'].includes(body?.attendance) ? body.attendance : null;
    const guestCount = Number.isInteger(body?.guestCount) ? Math.min(Math.max(body.guestCount, 0), 20) : 1;
    const guestSlug = typeof body?.guestSlug === 'string' ? body.guestSlug.slice(0, 160) : null;

    if (!guestName) return errorJson('Nama wajib diisi.', 400);
    if (!message) return errorJson('Ucapan doa wajib diisi.', 400);
    if (!attendance) return errorJson('Konfirmasi kehadiran tidak valid.', 400);

    let linkedSlug: string | null = null;
    if (guestSlug) {
      const found = await db.select({ slug: guests.slug }).from(guests).where(eq(guests.slug, guestSlug)).limit(1);
      linkedSlug = found.length > 0 ? guestSlug : null;
    }

    const [created] = await db
      .insert(rsvps)
      .values({ guestSlug: linkedSlug, guestName, attendance, guestCount: attendance === 'tidak_hadir' ? 0 : guestCount, message })
      .returning();

    return json({ rsvp: created }, 201);
  }

  return errorJson('Method tidak didukung.', 405);
};
