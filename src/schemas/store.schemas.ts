import { object, optional, string, z } from "zod";

export const createStoreSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    logo: optional(z.instanceof(File, { message: "Logo must be a file." })),
    bannerImage: optional(
      z.instanceof(File, { message: "Banner image must be a file." })
    ),
  }),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
