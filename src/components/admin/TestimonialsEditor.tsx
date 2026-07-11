"use client";

import { useState } from "react";
import { saveTestimonials } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/content";
import { Field, TextInput, TextArea, RemoveButton, AddButton, SaveBar } from "./ui";

export default function TestimonialsEditor({ initial }: { initial: Testimonial[] }) {
  const [list, setList] = useState(initial);
  const [dirty, setDirty] = useState(false);

  const set = (id: string, patch: Partial<Testimonial>) => {
    setList((l) => l.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    setDirty(true);
  };

  const remove = (id: string) => {
    setList((l) => l.filter((t) => t.id !== id));
    setDirty(true);
  };

  const add = () => {
    setList((l) => [
      ...l,
      {
        id: `review-${Date.now().toString(36)}`,
        quote: "",
        attribution: "",
        source: "Google review",
        rating: 5,
      },
    ]);
    setDirty(true);
  };

  return (
    <div className="max-w-[760px] space-y-6">
      {list.map((t, i) => (
        <div key={t.id} className="border border-tahini bg-garlic p-5">
          <Field label={`Quote ${i + 1}`}>
            <TextArea
              value={t.quote}
              onChange={(e) => set(t.id, { quote: e.target.value })}
            />
          </Field>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_110px]">
            <Field label="Name">
              <TextInput
                value={t.attribution}
                onChange={(e) => set(t.id, { attribution: e.target.value })}
              />
            </Field>
            <Field label="Source (optional)">
              <TextInput
                value={t.source ?? ""}
                onChange={(e) => set(t.id, { source: e.target.value || undefined })}
              />
            </Field>
            <Field label="Stars (1–5)">
              <TextInput
                inputMode="numeric"
                value={String(t.rating ?? 5)}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  if (Number.isInteger(n) && n >= 1 && n <= 5) set(t.id, { rating: n });
                }}
              />
            </Field>
          </div>
          <div className="mt-4 text-right">
            <RemoveButton onClick={() => remove(t.id)} label={`Remove quote ${i + 1}`} />
          </div>
        </div>
      ))}
      <AddButton onClick={add}>Add review</AddButton>
      <SaveBar dirty={dirty} onSave={() => saveTestimonials(list)} />
    </div>
  );
}
