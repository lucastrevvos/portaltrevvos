-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "trevvos_todo";

-- CreateEnum
CREATE TYPE "trevvos_todo"."TodoMemberRole" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "trevvos_todo"."TodoInviteRole" AS ENUM ('EDITOR', 'VIEWER');

-- CreateTable
CREATE TABLE "trevvos_todo"."guests" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3),

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trevvos_todo"."lists" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "owner_guest_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trevvos_todo"."list_members" (
    "list_id" UUID NOT NULL,
    "guest_id" UUID NOT NULL,
    "role" "trevvos_todo"."TodoMemberRole" NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_members_pkey" PRIMARY KEY ("list_id","guest_id")
);

-- CreateTable
CREATE TABLE "trevvos_todo"."todo_items" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_guest_id" UUID,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "todo_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trevvos_todo"."invites" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "role" "trevvos_todo"."TodoInviteRole" NOT NULL DEFAULT 'EDITOR',
    "expires_at" TIMESTAMP(3) NOT NULL,
    "max_uses" INTEGER NOT NULL DEFAULT 50,
    "uses" INTEGER NOT NULL DEFAULT 0,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_by_guest_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "todo_items_list_id_idx" ON "trevvos_todo"."todo_items"("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_key" ON "trevvos_todo"."invites"("token");

-- AddForeignKey
ALTER TABLE "trevvos_todo"."lists" ADD CONSTRAINT "lists_owner_guest_id_fkey" FOREIGN KEY ("owner_guest_id") REFERENCES "trevvos_todo"."guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trevvos_todo"."list_members" ADD CONSTRAINT "list_members_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "trevvos_todo"."lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trevvos_todo"."list_members" ADD CONSTRAINT "list_members_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "trevvos_todo"."guests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trevvos_todo"."todo_items" ADD CONSTRAINT "todo_items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "trevvos_todo"."lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trevvos_todo"."todo_items" ADD CONSTRAINT "todo_items_updated_by_guest_id_fkey" FOREIGN KEY ("updated_by_guest_id") REFERENCES "trevvos_todo"."guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trevvos_todo"."invites" ADD CONSTRAINT "invites_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "trevvos_todo"."lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trevvos_todo"."invites" ADD CONSTRAINT "invites_created_by_guest_id_fkey" FOREIGN KEY ("created_by_guest_id") REFERENCES "trevvos_todo"."guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
