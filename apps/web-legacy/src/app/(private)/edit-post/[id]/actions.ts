"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type { PostWithRelations, PostStatus } from "@trevvos/types";
import { apiFetch } from "apps/web/src/lib/api";
import { revalidatePath } from "next/cache";

export async function updatePostAction(id: string, formData: FormData) {
  const token = (await cookies()).get("accessToken")?.value;

  const categoryIds = formData.getAll("categoryIds") as string[];
  const tagIds = formData.getAll("tagIds") as string[];

  const intent =
    (formData.get("intent") as "save" | "publish" | "unpublish" | null) ??
    "save";
  const statusFromForm = formData.get("status") as PostStatus | null;

  let status: PostStatus = statusFromForm ?? "DRAFT";
  if (intent === "publish") status = "PUBLISHED";
  if (intent === "unpublish") status = "DRAFT";

  const payload = {
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    excerpt: (formData.get("excerpt") as string) || "",
    content: (formData.get("content") as string) || "",
    categoryIds,
    tagIds,
    status,
  };

  // TIPAR o retorno aqui resolve o erro
  const updated = await apiFetch<PostWithRelations>(`/posts/${id}`, {
    method: "PUT",
    accessToken: token,
    body: payload,
  });

  revalidatePath("/");
  redirect(`/post/${updated.slug ?? payload.slug}`);
}

export async function deletePostAction(id: string) {
  "use server";
  const token = (await cookies()).get("accessToken")?.value;

  await apiFetch<void>(`/posts/${id}`, {
    method: "DELETE",
    accessToken: token,
  });

  revalidatePath("/");
  redirect("/");
}
