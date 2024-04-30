import { array, object, optional, string, z } from "zod";

export const createCategorySchema = object({
  body: object({
    title: string({
      required_error: "Category title is required",
      invalid_type_error: "Category title must be a string",
    }),
    tags: optional(
      array(string({ invalid_type_error: "A tag must be of type string" }), {
        invalid_type_error: "Category's tags must an array of tags",
      })
    ),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
