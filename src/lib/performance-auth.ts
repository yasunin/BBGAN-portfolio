import { createHmac, randomUUID, timingSafeEqual } from "crypto";

export const ADMIN_SESSION_COOKIE = "performance_admin_session";
export const ADMIN_SESSION_MAX_AGE = 8 * 60 * 60;

export function getAdminKey(): string | undefined {
  return process.env.PERFORMANCE_ADMIN_KEY;
}

function secureCompare(value: string, expected: string): boolean {
  const valueBuffer = Buffer.from(value);
  const expectedBuffer = Buffer.from(expected);

  if (valueBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(valueBuffer, expectedBuffer);
}

export function verifyAdminPassword(password: unknown): boolean {
  const adminKey = getAdminKey();
  return typeof password === "string" && !!adminKey && secureCompare(password, adminKey);
}

export function verifyAdminKey(request: Request): boolean {
  return verifyAdminPassword(request.headers.get("x-admin-key"));
}

function signSession(payload: string): string | null {
  const adminKey = getAdminKey();
  if (!adminKey) return null;
  return createHmac("sha256", adminKey).update(payload).digest("base64url");
}

export function createAdminSessionToken(): string | null {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = `${issuedAt}.${randomUUID()}`;
  const signature = signSession(payload);
  return signature ? `${payload}.${signature}` : null;
}

function readCookie(request: Request, name: string): string | undefined {
  const prefix = `${name}=`;
  const cookie = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie?.slice(prefix.length);
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [issuedAtText, nonce, signature] = parts;
  const issuedAt = Number(issuedAtText);
  const now = Math.floor(Date.now() / 1000);

  if (
    !Number.isSafeInteger(issuedAt) ||
    !nonce ||
    issuedAt > now + 60 ||
    now - issuedAt > ADMIN_SESSION_MAX_AGE
  ) {
    return false;
  }

  const expectedSignature = signSession(`${issuedAtText}.${nonce}`);
  return !!expectedSignature && secureCompare(signature, expectedSignature);
}

export function isAdminAuthorized(request: Request): boolean {
  return (
    verifyAdminKey(request) ||
    verifyAdminSessionToken(readCookie(request, ADMIN_SESSION_COOKIE))
  );
}

export function unauthorizedResponse(): Response {
  return Response.json(
    { error: "ไม่มีสิทธิ์เข้าถึง กรุณาเข้าสู่ระบบแอดมิน" },
    { status: 401 }
  );
}
