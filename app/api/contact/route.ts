import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "LumaYard <onboarding@resend.dev>",
      to: process.env.CONTACT_TO_EMAIL ?? email,
      replyTo: email,
      subject: `New LumaYard inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
  }

  return NextResponse.redirect(new URL("/contact?sent=1", request.url));
}
