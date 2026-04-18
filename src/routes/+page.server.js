import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { user } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { setSessionAsync } from '$lib/session.js';

export async function load({ locals }) {
  if (locals.user) {
    throw redirect(302, '/profile');
  }
  return {};
}

export const actions = {
  register: async ({ request, cookies }) => {
    const data = await request.formData();

    const username = data.get('username')?.toString().trim();
    const password = data.get('password')?.toString();
    const passwordConfirm = data.get('passwordConfirm')?.toString();
    const leftPalmUrl = data.get('leftPalmUrl')?.toString().trim();
    const rightPalmUrl = data.get('rightPalmUrl')?.toString().trim();
    const gender = data.get('gender')?.toString();
    const dateOfBirth = data.get('dateOfBirth')?.toString() || null;
    const job = data.get('job')?.toString().trim() || null;
    const handed = data.get('handed')?.toString() || null;
    const q1 = data.get('q1')?.toString().trim() || null;
    const q2 = data.get('q2')?.toString().trim() || null;
    const q3 = data.get('q3')?.toString().trim() || null;

    // Validation
    const errors = {};

    if (!username || username.length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }
    if (!password || password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }
    if (password !== passwordConfirm) {
      errors.passwordConfirm = 'Passwords do not match.';
    }
    if (!leftPalmUrl) {
      errors.leftPalmUrl = 'Left palm photo URL is required.';
    }
    if (!rightPalmUrl) {
      errors.rightPalmUrl = 'Right palm photo URL is required.';
    }
    if (!gender) {
      errors.gender = 'Please select a gender.';
    }

    if (Object.keys(errors).length > 0) {
      return fail(422, {
        errors,
        values: { username, leftPalmUrl, rightPalmUrl, gender, dateOfBirth, job, handed, q1, q2, q3 }
      });
    }

    // Check username uniqueness
    const [existing] = await db.select().from(user).where(eq(user.username, username)).limit(1);
    if (existing) {
      return fail(422, {
        errors: { username: 'Username already taken.' },
        values: { username, leftPalmUrl, rightPalmUrl, gender, dateOfBirth, job, handed, q1, q2, q3 }
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db.insert(user).values({
      username,
      passwordHash,
      gender,
      dateOfBirth,
      job,
      handed,
      leftPalmUrl,
      rightPalmUrl
    }).returning();

    // Save questions if provided
    if (q1 || q2 || q3) {
      const { questions } = await import('$lib/db/schema.js');
      const qs = [q1, q2, q3].filter(Boolean).map(content => ({ content, userId: newUser.id }));
      if (qs.length > 0) {
        await db.insert(questions).values(qs);
      }
    }

    await setSessionAsync(cookies, newUser.id);
    throw redirect(302, '/profile');
  }
};
