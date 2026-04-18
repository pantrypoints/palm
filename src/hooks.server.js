import { getSession } from '$lib/session.js';
import { db } from '$lib/db/index.js';
import { user } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

export async function handle({ event, resolve }) {
  const session = await getSession(event.cookies);
  if (session?.userId) {
    const [u] = await db.select().from(user).where(eq(user.id, session.userId)).limit(1);
    event.locals.user = u ?? null;
  } else {
    event.locals.user = null;
  }
  return resolve(event);
}
