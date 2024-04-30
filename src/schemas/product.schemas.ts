import "reflect-metadata";

import Container from "typedi";
import { array, number, object, optional, string, z } from "zod";
import CategoryService from "../services/category.services";
import { CloudinaryResource } from "../types/product.types";
import UserService from "../services/user.services";
import { Readable } from "stream";
import { Types } from "mongoose";
import { tryCatch } from "../utils/errors/errors.utils";

// class MulterFile implements Express.Multer.File {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   size: number;
//   stream: Readable;
//   destination: string;
//   filename: string;
//   path: string;
//   buffer: Buffer;

//   constructor(
//     fieldname: string,
//     originalname: string,
//     encoding: string,
//     mimetype: string,
//     size: number,
//     stream: Readable,
//     destination: string,
//     filename: string,
//     path: string,
//     buffer: Buffer
//   ) {
//     this.fieldname = fieldname;
//     this.originalname = originalname;
//     this.encoding = encoding;
//     this.mimetype = mimetype;
//     this.size = size;
//     this.stream = stream;
//     this.destination = destination;
//     this.filename = filename;
//     this.path = path;
//     this.buffer = buffer;
//   }
// }

export const multerFile = object(
  {
    fieldname: string(),
    originalname: string(),
    encoding: string(),
    mimetype: string(),
    size: number(),
    stream: optional(z.instanceof(Readable)),
    destination: string(),
    filename: string(),
    path: string(),
    buffer: optional(z.instanceof(Buffer)),
  },
  { invalid_type_error: "Invalid file" }
);

export const createProductSchema = object({
  body: object({
    merchant: string({
      required_error: "Merchant must be provided",
      invalid_type_error: "Merchant must be a string",
    }),
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
    price: string({
      required_error: "Price is required",
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
  }).superRefine((data, ctx) => {
    const userService = Container.get(UserService);
    const catService = Container.get(CategoryService);

    try {
      // Check if passed value can be parsed into an ObjectId instance
      new Types.ObjectId(data.merchant);

      // Then proceed
      userService
        .getUser({
          id: data.merchant,
          throwExpection: false,
        })
        .then((user) => {
          if (!user || !user.isMerchant || user.hasBeenDeleted)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Unregistered merchant",
            });
        })
        .catch((error) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid merchant",
          });
        });
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid merchant",
      });
    }

    try {
      // Check if passed value can be parsed into an ObjectId instance
      new Types.ObjectId(data.category);

      catService
        .getCategory(data.category)
        .then((category) => {
          if (!category)
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "The category provided doesn't exist",
            });
        })
        .catch((error) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid category",
          });
        });
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid category",
      });
    }

    if (Number.isNaN(Number(data.price))) {
      ctx.addIssue({
        code: "invalid_type",
        expected: "number",
        received: typeof data.price,
        message: "Price must a number",
      });
    }
  }),

  files: object({
    mainImage: array(multerFile).min(1, {
      message: "Product's main image is required",
    }),
    additionals: optional(
      array(multerFile).max(4, {
        message: "Additional images can't exceed 4",
      })
    ),
  }),
});

export type CreateProductInput = {
  merchant: string;
  name: string;
  category: string;
  price: number;
  mainImage: CloudinaryResource;
  tags?: string[] | undefined;
  characteristics?: string[] | undefined;
  additionals?: CloudinaryResource[] | undefined;
};

export const getProductSchema = object({
  params: object({
    product: string({
      required_error: "Product reference isi required",
      invalid_type_error: "Product reference must be a string",
    }),
  }).superRefine((data, ctx) => {
    try {
      new Types.ObjectId(data.product);
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid product reference",
      });
    }
  }),
});

export type GetProductRule = z.infer<typeof getProductSchema>;
