import { apiFetch } from "apps/web/src/lib/api";
import NewPostForm from "./NewPostForm";
import type { Category, Tag } from "@trevvos/types";
import { getAccessToken } from "apps/web/src/lib/auth";

import { redirect } from "next/navigation";
import { fetchMe } from "apps/web/src/lib/auth.server";

export const dynamic = "force-dynamic";

const APP = process.env.NEXT_PUBLIC_APP_SLUG || "portal";
const ALLOWED_ROLES = ["OWNER", "ADMIN", "EDITOR"] as const;

function canPost(me: NonNullable<Awaited<ReturnType<typeof fetchMe>>>) {
  if (!me) return false;
  if (me.globalRole === "ADMIN") return true;

  const role = me.apps?.[APP];
  return role ? ALLOWED_ROLES.includes(role as any) : false;
}

export default async function NewPostPage() {
  const me = await fetchMe();

  if (!me) redirect("/login?next=/new-post");
  if (!canPost(me)) redirect("/");

  const token = await getAccessToken();

  const [categories, tags] = await Promise.all([
    apiFetch<Category[]>("/categories", token ? { accessToken: token } : {}),
    apiFetch<Tag[]>("/tags", token ? { accessToken: token } : {}),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Novo Post</h1>
      <NewPostForm
        categories={categories}
        tags={tags}
        accessToken={token ?? ""}
      />
    </main>
  );
}
