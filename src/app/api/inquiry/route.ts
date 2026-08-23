import { NextResponse } from "next/server";

export type InquiryPayload = {
  name: string;
  business?: string;
  contact: string;
  problem: string;
};

function isValidPayload(data: unknown): data is InquiryPayload {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.name === "string" &&
    d.name.trim().length > 0 &&
    typeof d.contact === "string" &&
    d.contact.trim().length > 0 &&
    typeof d.problem === "string" &&
    d.problem.trim().length > 0
  );
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json(
      {
        error:
          "Please include your name, a way to reach you, and a short description of the problem.",
      },
      { status: 422 },
    );
  }

  const endpoint = process.env.CONTACT_FORM_ENDPOINT;

  if (!endpoint) {
    // No relay configured yet — see docs/DEPLOYMENT.md. Fail loudly rather than
    // pretending the inquiry was delivered (see docs/LLD.md §5).
    console.error("CONTACT_FORM_ENDPOINT is not configured.");
    return NextResponse.json(
      { error: "The inquiry endpoint isn't configured yet. Please use WhatsApp instead." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Relay responded with ${response.status}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to forward inquiry:", error);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please try WhatsApp instead." },
      { status: 502 },
    );
  }
}
