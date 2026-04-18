import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { user } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { setSessionAsync } from '$lib/session.js';

export async function load({ locals }) {
  if (locals.user) throw redirect(302, '/profile');
  return {};
}

export const actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString();

    if (!username || !password) {
      return fail(422, { error: 'Please fill in all fields.', username });
    }

    const [u] = await db.select().from(user).where(eq(user.username, username)).limit(1);
    if (!u) {
      return fail(401, { error: 'Invalid username or password.', username });
    }

    const valid = await bcrypt.compare(password, u.passwordHash);
    if (!valid) {
      return fail(401, { error: 'Invalid username or password.', username });
    }

    await setSessionAsync(cookies, u.id);
    throw redirect(302, '/profile');
  }
};
