import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { signAdminToken, setAuthCookie } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { errorResponse } from "@/utils/responses";
import { loginSchema } from "@/utils/validators";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return errorResponse("Dados de login invalidos.", 422, parsed.error.flatten());
  }

  const admin = await prisma.admin.findUnique({
    where: { email: parsed.data.email }
  });

  if (!admin) {
    return errorResponse("Email ou senha invalidos.", 401);
  }

  const passwordMatches = await bcrypt.compare(parsed.data.senha, admin.senhaHash);
  if (!passwordMatches) {
    return errorResponse("Email ou senha invalidos.", 401);
  }

  const token = signAdminToken({
    id: admin.id,
    nome: admin.nome,
    email: admin.email
  });

  const response = NextResponse.json({
    admin: {
      nome: admin.nome,
      email: admin.email
    }
  });
  setAuthCookie(response, token);

  return response;
}
