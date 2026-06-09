import { NextResponse } from "next/server";
import { defaultBannerData } from "@/utils/defaults";
import { prisma } from "@/utils/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const banner = await prisma.banner.findFirst({
    orderBy: { atualizadoEm: "desc" }
  });

  if (banner) {
    return NextResponse.json({ banner });
  }

  const created = await prisma.banner.create({
    data: defaultBannerData
  });

  return NextResponse.json({ banner: created });
}
