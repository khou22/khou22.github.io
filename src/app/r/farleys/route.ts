import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { PAGES } from "@/utils/pages";

export async function GET(_req: NextRequest) {
  redirect(
    `${PAGES.PHOTOGRAPHY.FARLEYS_POTRERO}?referrer=${encodeURIComponent(
      PAGES.REDIRECTS.FARLEYS,
    )}`,
  );
}
