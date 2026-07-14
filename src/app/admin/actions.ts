"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  checkPassword,
  cmsEnabled,
  createSession,
  destroySession,
  isAdmin,
} from "@/lib/cms/auth";
import { saveOverlaySection } from "@/lib/cms/store";
import {
  siteEditableSchema,
  menuCategorySchema,
  menuItemSchema,
  testimonialSchema,
  faqItemSchema,
} from "@/lib/cms/schema";
import { z } from "zod";

export type SaveResult = { ok: true } | { ok: false; error: string };

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (cmsEnabled() && checkPassword(password)) {
    await createSession();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}

async function guard(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Not signed in.");
}

/** Every save revalidates the whole tree — content reaches every route. */
function revalidateSite(): void {
  revalidatePath("/", "layout");
  revalidatePath("/llms.txt"); // the AEO brief mirrors CMS content
}

/** Owner-readable version of the first validation issue ("Item 3 — name: …"). */
function firstIssue(error: z.ZodError, noun: string): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid data.";
  const path = issue.path;
  const where =
    typeof path[0] === "number"
      ? `${noun} ${Number(path[0]) + 1}${path.length > 1 ? ` — ${path.slice(1).join(".")}` : ""}`
      : path.join(".");
  return `${where}: ${issue.message}`;
}

async function save<T>(
  schema: z.ZodType<T>,
  data: unknown,
  key: string,
  noun: string,
): Promise<SaveResult> {
  await guard();
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { ok: false, error: firstIssue(parsed.error, noun) };
  await saveOverlaySection({ [key]: parsed.data });
  revalidateSite();
  return { ok: true };
}

export async function saveSite(data: unknown): Promise<SaveResult> {
  return save(siteEditableSchema, data, "site", "Field");
}

/** Categories + items validated together, written in ONE atomic overlay write —
    a bad item can never leave half the menu saved. */
export async function saveMenuAndCategories(
  categories: unknown,
  menu: unknown,
): Promise<SaveResult> {
  await guard();
  const cats = z.array(menuCategorySchema).min(1).safeParse(categories);
  if (!cats.success) return { ok: false, error: firstIssue(cats.error, "Category") };
  const items = z.array(menuItemSchema).min(1).safeParse(menu);
  if (!items.success) return { ok: false, error: firstIssue(items.error, "Item") };
  await saveOverlaySection({ categories: cats.data, menu: items.data });
  revalidateSite();
  return { ok: true };
}

export async function saveTestimonials(data: unknown): Promise<SaveResult> {
  return save(z.array(testimonialSchema), data, "testimonials", "Review");
}

export async function saveFaq(data: unknown): Promise<SaveResult> {
  return save(z.array(faqItemSchema), data, "faq", "Question");
}
