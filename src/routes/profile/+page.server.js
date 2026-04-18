import { redirect } from '@sveltejs/kit';
import { db } from '$lib/db/index.js';
import { questions, answers, user } from '$lib/db/schema.js';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
  if (!locals.user) throw redirect(302, '/login');

  const u = locals.user;

  // Load questions with their answers
  const userQuestions = await db
    .select()
    .from(questions)
    .where(eq(questions.userId, u.id));

  const questionsWithAnswers = await Promise.all(
    userQuestions.map(async (q) => {
      const ans = await db
        .select()
        .from(answers)
        .where(eq(answers.qid, q.id));
      return { ...q, answers: ans };
    })
  );

  return {
    profile: {
      id: u.id,
      username: u.username,
      avatar: u.avatar,
      gender: u.gender,
      dateOfBirth: u.dateOfBirth,
      job: u.job,
      handed: u.handed,
      leftPalmUrl: u.leftPalmUrl,
      rightPalmUrl: u.rightPalmUrl,
      dateCreated: u.dateCreated,
      kind: u.kind
    },
    questions: questionsWithAnswers
  };
}
