import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

/**
 * Endpoint to redirect the user to a Calendly meeting.
 */
export async function GET(_request: NextRequest, _response: NextResponse) {
  const link = process.env.MEETING_SCHEDULER_URL;
  if (!link) {
    return new NextResponse("No meeting scheduler URL found", { status: 500 });
  }
  return NextResponse.redirect(link, 307);
}
