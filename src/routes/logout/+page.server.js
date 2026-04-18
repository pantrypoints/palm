import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/session.js';

export const actions = {
  default: async ({ cookies }) => {
    clearSession(cookies);
    throw redirect(302, '/');
  }
};
