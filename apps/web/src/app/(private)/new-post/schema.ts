import { z } from "zod";

export const PostFormSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug muito curto")
    .max(120, "Slug muito longo")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use kebab-case (minúsculas, números e hífens)"
    ),
  title: z.string().min(3, "Título muito curto"),
  excerpt: z
    .string()
    .max(300, "Resumo muito longo")
    .optional()
    .or(z.literal("")),
  content: z.string().min(1, "Conteúdo obrigatório"),

  // defaults garantem array na SAÍDA (output)
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),

  intent: z.enum(["save", "publish"]).default("save"),
});

// 👇 diferencie input x output
export type PostFormInput = z.input<typeof PostFormSchema>; // pode ter undefined
export type PostFormOutput = z.output<typeof PostFormSchema>; // garantido com defaults
