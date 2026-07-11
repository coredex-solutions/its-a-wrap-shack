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
}

async function save<T>(schema: z.ZodType<T>, data: unknown, key: string): Promise<SaveResult> {
  await guard();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return {
      ok: false,
      error: `${first?.path.join(".") ?? ""}: ${first?.message ?? "invalid data"}`,
    };
  }
  await saveOverlaySection({ [key]: parsed.data });
  revalidateSite();
  return { ok: true };
}

export async function saveSite(data: unknown): Promise<SaveResult> {
  return save(siteEditableSchema, data, "site");
}

export async function saveMenu(data: unknown): Promise<SaveResult> {
  const result = await save(z.array(menuItemSchema).min(1), data, "menu");
  return result;
}

export async function saveCategories(data: unknown): Promise<SaveResult> {
  return save(z.array(menuCategorySchema).min(1), data, "categories");
}

export async function saveTestimonials(data: unknown): Promise<SaveResult> {
  return save(z.array(testimonialSchema), data, "testimonials");
}

export async function saveFaq(data: unknown): Promise<SaveResult> {
  return save(z.array(faqItemSchema), data, "faq");
}
