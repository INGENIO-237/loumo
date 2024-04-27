import { array, number, object, optional, string, z } from "zod";

export const createUserSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    phone: optional(string({ invalid_type_error: "Invalid phone number" })),
    password: string({ required_error: "Password is required" }).min(
      6,
      "Password must be at least 6 chars long."
    ),
    shippingAddress: optional(
      object({
        location: string({
          invalid_type_error: "Shipping Address location must be a string",
        }),
        coords: object({
          lat: number({
            invalid_type_error: "Shipping Address Latitude must be a number",
          }),
          lng: number({
            invalid_type_error: "Shipping Address Longitude must be a number",
          }),
        }),
      })
    ),
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = object({
  params: object({
    user: string({
      required_error: "User ID is required",
      invalid_type_error: "User ID must be a string",
    }),
  }),
  body: object({
    email: optional(string().email("Invalid email format")),
    phone: optional(string({ invalid_type_error: "Invalid phone number" })),
    password: optional(
      string().min(6, "Password must be at least 6 chars long.")
    ),
    shippingAddress: optional(
      object({
        location: string({
          invalid_type_error: "Shipping Address location must be a string",
        }),
        coords: object({
          lat: number({
            invalid_type_error: "Shipping Address Latitude must be a number",
          }),
          lng: number({
            invalid_type_error: "Shipping Address Longitude must be a number",
          }),
        }),
      })
    ),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const updateUserProfileSchema = object({
  body: object({
    email: optional(string().email("Invalid email format")),
    phone: optional(string({ invalid_type_error: "Invalid phone number" })),
    password: optional(
      string().min(6, "Password must be at least 6 chars long.")
    ),
    shippingAddress: optional(
      object({
        location: string({
          invalid_type_error: "Shipping Address location must be a string",
        }),
        coords: object({
          lat: number({
            invalid_type_error: "Shipping Address Latitude must be a number",
          }),
          lng: number({
            invalid_type_error: "Shipping Address Longitude must be a number",
          }),
        }),
      })
    ),
  }),
});

export type UpdateUserProfileInput = z.infer<typeof updateUserSchema>;
