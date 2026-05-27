import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

function trimEnv(value: string | undefined): string {
  return value?.trim() ?? "";
}

function getAdminPassword() {
  const fromEnv = trimEnv(process.env.ADMIN_PASSWORD);
  return fromEnv || "admin";
}

function getSessionSecret() {
  const fromEnv =
    trimEnv(process.env.ADMIN_SESSION_SECRET) || trimEnv(process.env.ADMIN_PASSWORD);
  return fromEnv || "admin";
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return timingSafeEqual(bufferA, bufferB);
}

export function createSessionToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

function isValidSessionPayload(payload: string) {
  const [issuedAt, signature] = payload.split(".");
  if (!issuedAt || !signature) {
    return false;
  }

  const expectedSignature = sign(issuedAt);
  return safeEqual(signature, expectedSignature);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  };
}

/** Set session on a Route Handler response (reliable in production). */
export function attachSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
}

/** Clear session on a Route Handler response. */
export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    ...getSessionCookieOptions(),
    maxAge: 0,
  });
}

export function verifyAdminPassword(password: string) {
  return safeEqual(password.trim(), getAdminPassword());
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!session) {
    return false;
  }

  return isValidSessionPayload(session);
}

/** @deprecated Prefer attachSessionCookie on NextResponse in API routes */
export async function createAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), getSessionCookieOptions());
}

/** @deprecated Prefer clearSessionCookie on NextResponse in API routes */
export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}
