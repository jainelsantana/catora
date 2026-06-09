import jwt from "jsonwebtoken";
import type { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/utils/auth-constants";
import { prisma } from "@/utils/prisma";

export type AdminSession = {
  id: string;
  nome: string;
  email: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET precisa ser configurado em producao.");
  }

  return secret ?? "catalogoora-dev-secret";
}

function shouldUseSecureCookie() {
  return process.env.AUTH_SECURE_COOKIES === "true";
}

export function signAdminToken(admin: AdminSession) {
  return jwt.sign(admin, getJwtSecret(), {
    subject: admin.id,
    expiresIn: "7d"
  });
}

export function verifyAdminToken(token?: string) {
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, getJwtSecret()) as AdminSession;
    if (!payload.id || !payload.email) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const session = verifyAdminToken(token);

  if (!session) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.id },
    select: { id: true, nome: true, email: true }
  });

  return admin;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: shouldUseSecureCookie(),
    path: "/",
    maxAge: 0
  });
}
