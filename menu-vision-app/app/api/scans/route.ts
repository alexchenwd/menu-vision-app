import { NextResponse } from "next/server";
import { createScan, listScans } from "@/lib/scan-store";

export async function GET() {
  return NextResponse.json({ scans: listScans() });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    fileName?: string;
    imagePreviewUrl?: string;
  };

  if (!body.fileName) {
    return NextResponse.json(
      { error: "fileName is required" },
      { status: 400 }
    );
  }

  const scan = await createScan({
    fileName: body.fileName,
    imagePreviewUrl: body.imagePreviewUrl
  });

  return NextResponse.json({ scanId: scan.id, scan });
}
