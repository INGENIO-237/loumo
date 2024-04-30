import { object, optional, string, z } from "zod";
import { CloudinaryResource } from "../types/product.types";

export const createStoreSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }),
    logo: optional(z.instanceof(File, { message: "Logo must be a file." })),
    bannerImage: optional(
      z.instanceof(File, { message: "Banner image must be a file." })
    ),
  }),
});

/**
 * Logo and BannerImage as CloudinaryResources(custom type)
 * cause we'll only store the url and publicId(for deletion purpose)
 * of the remote image *
 * */
export type CreateStoreInput = {
  user: string;
  name: string;
  logo?: CloudinaryResource;
  bannerImage?: CloudinaryResource;
};

export const updateStoreSchema = object({
  params: object({
    storeId: string({ required_error: "Store ID is required" }),
  }),
  body: object({
    name: optional(string()),
    logo: optional(z.instanceof(File, { message: "Logo must be a file." })),
    bannerImage: optional(
      z.instanceof(File, { message: "Banner image must be a file." })
    ),
  }),
});

export type UpdateStoreInput = {
  name?: string;
  logo?: CloudinaryResource;
  bannerImage?: CloudinaryResource;
};
