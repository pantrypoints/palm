export async function load({ locals }) {
  return {
    user: locals.user
      ? {
          id: locals.user.id,
          username: locals.user.username,
          avatar: locals.user.avatar,
          kind: locals.user.kind
        }
      : null
  };
}
