"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";

const inputCls =
  "w-full border border-tahini bg-cream px-4 py-3 text-[15px] text-charcoal " +
  "placeholder:text-charcoal-60/60 transition-[border-color,box-shadow] duration-250 " +
  "focus:border-olive focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactInput) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="eyebrow mb-2 block text-charcoal-60">
            Name
          </label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "cf-name-err" : undefined}
            className={inputCls}
            {...register("name")}
          />
          {errors.name && (
            <p id="cf-name-err" role="alert" className="mt-1.5 text-[13px] text-gold">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow mb-2 block text-charcoal-60">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "cf-email-err" : undefined}
            className={inputCls}
            {...register("email")}
          />
          {errors.email && (
            <p id="cf-email-err" role="alert" className="mt-1.5 text-[13px] text-gold">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cf-phone" className="eyebrow mb-2 block text-charcoal-60">
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="cf-phone"
          type="tel"
          autoComplete="tel"
          className={inputCls}
          {...register("phone")}
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="eyebrow mb-2 block text-charcoal-60">
          Message
        </label>
        <textarea
          id="cf-message"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "cf-message-err" : undefined}
          className={inputCls}
          {...register("message")}
        />
        {errors.message && (
          <p id="cf-message-err" role="alert" className="mt-1.5 text-[13px] text-gold">
            {errors.message.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex items-center gap-3 rounded-full bg-forest px-8 py-[15px] text-[13px] font-semibold uppercase tracking-[0.1em] text-cream transition-[background-color,box-shadow] duration-250 ease-brand hover:bg-forest-deep hover:shadow-[inset_0_0_0_1px_var(--color-gold)] disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send message"}
          <span
            aria-hidden
            className="inline-block transition-transform duration-250 ease-brand group-hover:translate-x-1"
          >
            →
          </span>
        </button>
        <p aria-live="polite" className="text-[14px] text-charcoal-60">
          {status === "sent" && "Thank you — we'll get back to you soon."}
          {status === "error" &&
            "Something went sideways. Please call us instead."}
        </p>
      </div>
    </form>
  );
}
