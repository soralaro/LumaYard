"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");
    const form = event.currentTarget;
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const result = (await response.json()) as { message?: string; error?: string };
      if (!response.ok) throw new Error(result.error ?? "We could not send your inquiry.");
      setStatus("success");
      setMessage(result.message ?? "Thanks. We will be in touch shortly.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "We could not send your inquiry.");
    }
  }

  return (
    <form onSubmit={submit} className="bg-[#f5f2eb] p-6 sm:p-10" aria-busy={status === "submitting"}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536058]">Your name<input name="name" required maxLength={80} autoComplete="name" className="mt-2 w-full border-b border-[#19382f]/30 bg-transparent py-3 text-base font-normal normal-case tracking-normal text-[#19382f] outline-none focus:border-[#19382f]" /></label>
        <label className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#536058]">Email address<input type="email" name="email" required maxLength={254} autoComplete="email" className="mt-2 w-full border-b border-[#19382f]/30 bg-transparent py-3 text-base font-normal normal-case tracking-normal text-[#19382f] outline-none focus:border-[#19382f]" /></label>
      </div>
      <label className="mt-8 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#536058]">What are you creating?<textarea name="message" required maxLength={4000} rows={6} className="mt-2 w-full resize-none border-b border-[#19382f]/30 bg-transparent py-3 text-base font-normal normal-case tracking-normal text-[#19382f] outline-none focus:border-[#19382f]" placeholder="Tell us about your space, your ideas, or what you need help with." /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-px w-px opacity-0" aria-hidden="true" />
      <button type="submit" disabled={status === "submitting"} className="mt-8 inline-flex min-h-13 items-center bg-[#19382f] px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white hover:bg-[#102c25] disabled:cursor-wait disabled:opacity-60">{status === "submitting" ? "Sending..." : "Send inquiry"}<span className="ml-3" aria-hidden="true">→</span></button>
      {message && <p role={status === "error" ? "alert" : "status"} className={`mt-5 text-sm leading-6 ${status === "error" ? "text-[#a34d35]" : "text-[#35634f]"}`}>{message}</p>}
    </form>
  );
}
