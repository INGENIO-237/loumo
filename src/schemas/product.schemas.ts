import "reflect-metadata";

import Container from "typedi";
import { array, number, object, optional, string, z } from "zod";
import CategoryService from "../services/category.services";

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: "Product name is required",
      invalid_type_error: "Product name must be a string",
    }),
    category: string({
      required_error: "Category must be provided",
      invalid_type_error: "Category must be a string",
    }),
    tags: optional(
      array(string({ invalid_type_error: "A tag must be of type string" }), {
        invalid_type_error: "Product's tags must be an array of tags",
      })
    ),
    price: number({
      required_error: "Price is required",
      invalid_type_error: "Price must be of type number",
    }),
    characteristics: optional(
      array(
        string({
          invalid_type_error: "A characteristics must be of type string",
        }),
        {
          invalid_type_error:
            "Characteristics must be an array of charateristics",
        }
      )
    ),
    mainImage: z.instanceof(File, {
      message: "Product's main image is required and must be of type file",
    }),
    additionals: optional(
      array(
        z.instanceof(File, { message: "Additional resource must be an image" })
      ).max(4, { message: "Additional images number can't exceed 4" })
    ),
  }).superRefine(async (data, ctx) => {
    const catService = Container.get(CategoryService);

    const category = await catService.getCategory(data.category);

    if (!category)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The category provided doesn't exist",
      });
  }),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
