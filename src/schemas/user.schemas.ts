import { array, number, object, optional, string, z } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    phone: optional(    
      object({
        country: object({
          code: number({
            invalid_type_error: "country code must a number (phone)",
          }),
          name: string({
            invalid_type_error: "country name must a string (phone)",
          }),
          shortName: string({
            invalid_type_error: "country short name must a string (phone)",
          }),
        }),
        value: number({ invalid_type_error: "Phone must be a number" }),
      })
    ),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be at least 6 chars long."
    ),
    shippingAddresses: optional(
      array(
        object({
          street: string({ invalid_type_error: "Street must be a string" }),
          city: string({ invalid_type_error: "City must be a string" }),
          country: string({
            invalid_type_error: "Country name must be a string",
          }),
        })
      )
    ),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
