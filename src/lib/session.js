import { env } from '$env/dynamic/private';

const COOKIE_NAME = 'pp_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Simple HMAC-based session using Web Crypto API
 */
async function sign(value) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(env.SESSION_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value));
  const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return `${value}.${b64}`;
}

async function verify(signed) {
  const idx = signed.lastIndexOf('.');
  if (idx === -1) return null;
  const value = signed.slice(0, idx);
  const expected = await sign(value);
  return expected === signed ? value : null;
}

export function setSession(cookies, userId) {
  const payload = JSON.stringify({ userId, ts: Date.now() });
  const encoded = btoa(payload);
  sign(encoded).then((signed) => {
    cookies.set(COOKIE_NAME, signed, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: MAX_AGE,
      secure: process.env.NODE_ENV === 'production'
    });
  });
}

export async function setSessionAsync(cookies, userId) {
  const payload = JSON.stringify({ userId, ts: Date.now() });
  const encoded = btoa(payload);
  const signed = await sign(encoded);
  cookies.set(COOKIE_NAME, signed, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: MAX_AGE,
    secure: process.env.NODE_ENV === 'production'
  });
}

export async function getSession(cookies) {
  const signed = cookies.get(COOKIE_NAME);
  if (!signed) return null;
  try {
    const encoded = await verify(signed);
    if (!encoded) return null;
    return JSON.parse(atob(encoded));
  } catch {
    return null;
  }
}

export function clearSession(cookies) {
  cookies.delete(COOKIE_NAME, { path: '/' });
}
