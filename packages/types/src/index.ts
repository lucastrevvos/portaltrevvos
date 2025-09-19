// Tipos puros (sem importar @prisma/client) para o front

// enums/aliases compatíveis com o Prisma
export type GlobalRole = "ADMIN" | "EDITOR" | "USER";
export type AppRole = "OWNER" | "ADMIN" | "EDITOR" | "AUTHOR" | "READER";

export type PostStatus = "DRAFT" | "PUBLISHED";

export type Me = {
  id: string;
  name?: string;
  role?: string;
  globalRole?: string;
  apps?: Record<string, string>;
} | null;

export type UserLite = {
  id: string;
  name: string | null;
  email: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type PostCategory = {
  postId: string;
  categoryId: string;
  category?: Category;
};

export type PostTag = {
  postId: string;
  tagId: string;
  tag?: Tag;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  status: PostStatus;
  publishedAt?: string | null; // ISO
  updatedAt: string; // ISO
  createdAt: string; // ISO
  authorId: string;
};

export type PostWithRelations = Post & {
  categories: (PostCategory & { category?: Category })[];
  tags: (PostTag & { tag?: Tag })[];
  author: UserLite;
};
