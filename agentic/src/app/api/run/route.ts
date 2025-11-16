import { NextResponse } from "next/server";

import { parseAgentRequest, runPipeline } from "@/lib/pipeline";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = parseAgentRequest(payload);
    const result = await runPipeline(parsed);

    return NextResponse.json(
      {
        success: true,
        downloadUrl: result.downloadUrl,
        designId: result.designId,
        exportId: result.exportId,
        assetId: result.assetId,
        logs: result.logs,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
