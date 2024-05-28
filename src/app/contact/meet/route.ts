import { NextRequest, NextResponse } from "next/server";

/**
 * Endpoint to redirect the user to a Calendly meeting.
 */
export async function GET(_request: NextRequest, _response: NextResponse) {
  const link = process.env.MEETING_SCHEDULER_URL;
  if (!link) {
    throw new Error("No meeting scheduler URL found");
  }
  return NextResponse.redirect(link, 307);
}
