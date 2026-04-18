import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { user, questions, answers } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
  if (!locals.user || locals.user.kind !== 'admin') {
    throw redirect(302, '/profile');
  }

  const allUsers = await db.select().from(user);

  const allQuestions = await db.select().from(questions);

  const allAnswers = await db.select().from(answers);

  // Group questions by user, attach answers
  const usersWithData = allUsers.map((u) => {
    const userQs = allQuestions
      .filter((q) => q.userId === u.id)
      .map((q) => ({
        ...q,
        answers: allAnswers.filter((a) => a.qid === q.id)
      }));
    return { ...u, questions: userQs };
  });

  return { users: usersWithData };
}

export const actions = {
  answer: async ({ request, locals }) => {
    if (!locals.user || locals.user.kind !== 'admin') {
      return fail(403, { error: 'Unauthorized' });
    }

    const data = await request.formData();
    const qid = parseInt(data.get('qid')?.toString() ?? '');
    const content = data.get('content')?.toString().trim();

    if (!qid || !content) {
      return fail(422, { error: 'Missing question ID or answer content.' });
    }

    await db.insert(answers).values({ content, qid });
    return { success: true };
  },

  deleteAnswer: async ({ request, locals }) => {
    if (!locals.user || locals.user.kind !== 'admin') {
      return fail(403, { error: 'Unauthorized' });
    }

    const data = await request.formData();
    const answerId = parseInt(data.get('answerId')?.toString() ?? '');

    if (!answerId) return fail(422, { error: 'Missing answer ID.' });

    await db.delete(answers).where(eq(answers.id, answerId));
    return { success: true };
  }
};
