import { NextResponse } from "next/server";
import { Resend } from "resend";

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;

function getClientKey(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  const key = getClientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (current && current.resetAt > now && current.count >= MAX_ATTEMPTS) return NextResponse.json({ error: "Too many inquiries. Please try again in a minute." }, { status: 429 });
  attempts.set(key, current && current.resetAt > now ? { count: current.count + 1, resetAt: current.resetAt } : { count: 1, resetAt: now + WINDOW_MS });

  let values: Record<string, unknown>;
  try {
    values = request.headers.get("content-type")?.includes("application/json") ? await request.json() : Object.fromEntries((await request.formData()).entries());
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (String(values.website ?? "").trim()) return NextResponse.json({ message: "Thanks. We will be in touch shortly." });
  const name = String(values.name ?? "").trim();
  const email = String(values.email ?? "").trim();
  const message = String(values.message ?? "").trim();
  if (!name || !email || !message) return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  if (name.length > 80 || email.length > 254 || message.length > 4000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({ from: process.env.CONTACT_FROM_EMAIL ?? "LumaYard <onboarding@resend.dev>", to: process.env.CONTACT_TO_EMAIL ?? email, replyTo: email, subject: `New LumaYard inquiry from ${name}`, text: `Name: ${name}\nEmail: ${email}\n\n${message}` });
    } catch {
      return NextResponse.json({ error: "We could not deliver your inquiry. Please try again shortly." }, { status: 502 });
    }
  }
  return NextResponse.json({ message: "Thanks. We will be in touch shortly." });
}
