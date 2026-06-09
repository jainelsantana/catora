import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/utils/auth";
import { errorResponse } from "@/utils/responses";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const admin = await getAdminSession(request);

  if (!admin) {
    return errorResponse("Sessao expirada ou invalida.", 401);
  }

  return NextResponse.json({
    admin: {
      nome: admin.nome,
      email: admin.email
    }
  });
}
