"use client";

import { useState } from "react";
import { saveMenu, saveCategories } from "@/app/admin/actions";
import { DIETARY } from "@/lib/cms/schema";
import type { MenuCategory, MenuItem } from "@/lib/content";
import {
  Field,
  TextInput,
  TextArea,
  Checkbox,
  RemoveButton,
  AddButton,
  SaveBar,
} from "./ui";

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function MenuEditor({
  initialCategories,
  initialMenu,
}: {
  initialCategories: MenuCategory[];
  initialMenu: MenuItem[];
}) {
  const [cats, setCats] = useState(initialCategories);
  const [items, setItems] = useState(initialMenu);
  const [open, setOpen] = useState<string | null>(initialCategories[0]?.id ?? null);
  const [dirty, setDirty] = useState(false);

  const touch = () => setDirty(true);

  const setItem = (id: string, patch: Partial<MenuItem>) => {
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));
    touch();
  };

  const removeItem = (id: string) => {
    setItems((list) => list.filter((it) => it.id !== id));
    touch();
  };

  const addItem = (category: MenuCategory["id"]) => {
    const base: MenuItem = {
      id: `new-item-${items.length + 1}`,
      category,
      name: "",
      description: "",
      price: 0,
      dietary: [],
    };
    setItems((list) => [...list, base]);
    touch();
  };

  const setCat = (id: string, patch: Partial<MenuCategory>) => {
    setCats((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    touch();
  };

  const save = async () => {
    // stabilize ids from names for newly added items
    const normalized = items.map((it) =>
      it.id.startsWith("new-item-") && it.name
        ? { ...it, id: `${slug(it.name)}` }
        : it,
    );
    const catResult = await saveCategories(cats);
    if (!catResult.ok) return catResult;
    const menuResult = await saveMenu(normalized);
    if (menuResult.ok) setItems(normalized);
    return menuResult;
  };

  return (
    <div>
      {cats.map((cat) => {
        const catItems = items.filter((it) => it.category === cat.id);
        const expanded = open === cat.id;
        return (
          <section key={cat.id} className="border-b border-tahini py-2">
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : cat.id)}
              aria-expanded={expanded}
              className="flex w-full items-center justify-between py-3 text-left"
            >
              <span className="font-display text-[1.6rem] font-medium text-charcoal">
                {cat.label}{" "}
                <span className="ml-2 text-[13px] font-body text-charcoal-60">
                  {catItems.length} items
                </span>
              </span>
              <span aria-hidden className="text-[1.3rem] text-charcoal-60">
                {expanded ? "–" : "+"}
              </span>
            </button>

            {expanded && (
              <div className="space-y-6 pb-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Category label">
                    <TextInput
                      value={cat.label}
                      onChange={(e) => setCat(cat.id, { label: e.target.value })}
                    />
                  </Field>
                  <Field label="Category note (small print, optional)">
                    <TextInput
                      value={cat.note ?? ""}
                      onChange={(e) =>
                        setCat(cat.id, { note: e.target.value || undefined })
                      }
                    />
                  </Field>
                </div>

                {catItems.map((it) => (
                  <div key={it.id} className="border border-tahini bg-garlic p-5">
                    <div className="grid gap-4 sm:grid-cols-[1fr_130px_130px]">
                      <Field label="Name">
                        <TextInput
                          value={it.name}
                          onChange={(e) => setItem(it.id, { name: e.target.value })}
                        />
                      </Field>
                      <Field label="Price ($)" hint="Empty = “ask in store”">
                        <TextInput
                          inputMode="decimal"
                          value={it.price === null ? "" : String(it.price)}
                          onChange={(e) => {
                            const v = e.target.value.trim();
                            const n = Number(v);
                            setItem(it.id, {
                              price: v === "" ? null : Number.isFinite(n) ? n : it.price,
                            });
                          }}
                        />
                      </Field>
                      <Field label="Price note" hint="e.g. “3 for”">
                        <TextInput
                          value={it.priceNote ?? ""}
                          onChange={(e) =>
                            setItem(it.id, { priceNote: e.target.value || undefined })
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4">
                      <Field label="Description">
                        <TextArea
                          value={it.description}
                          onChange={(e) =>
                            setItem(it.id, { description: e.target.value })
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                      {DIETARY.map((d) => (
                        <Checkbox
                          key={d}
                          label={d}
                          checked={it.dietary.includes(d)}
                          onChange={(on) =>
                            setItem(it.id, {
                              dietary: on
                                ? [...it.dietary, d]
                                : it.dietary.filter((x) => x !== d),
                            })
                          }
                        />
                      ))}
                      <Checkbox
                        label="house favorite"
                        checked={Boolean(it.featured)}
                        onChange={(on) =>
                          setItem(it.id, { featured: on || undefined })
                        }
                      />
                      <span className="ml-auto">
                        <RemoveButton
                          onClick={() => removeItem(it.id)}
                          label={`Remove ${it.name || "item"}`}
                        />
                      </span>
                    </div>
                  </div>
                ))}

                <AddButton onClick={() => addItem(cat.id)}>
                  Add item to {cat.label}
                </AddButton>
              </div>
            )}
          </section>
        );
      })}

      <SaveBar dirty={dirty} onSave={save} />
    </div>
  );
}
