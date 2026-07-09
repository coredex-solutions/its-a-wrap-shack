import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

/**
 * TODO(owner): wire this to a real destination.
 * This is a deliberate STUB — it validates and accepts the submission but
 * does not deliver it anywhere yet. Options when ready:
 *   - transactional email (Resend/Postmark/SES) to itsawrapshack@outlook.com
 *   - or store in the future CMS (Cloudflare D1) with a notification
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  // TODO(owner): deliver parsed.data — currently logged server-side only.
  console.info("[contact] submission received (NOT delivered — stub):", {
    name: parsed.data.name,
    email: parsed.data.email,
  });

  return NextResponse.json({ ok: true });
}
