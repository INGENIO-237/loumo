import { object, string, z } from "zod";

export const createSessionSchema = object({
  body: object({
    email: string({ required_error: "Email is required" }).email(
      "Invalid email format"
    ),
    password: string({ required_error: "Password is required" }),
  }),
});

export type CreateSessionInput = z.infer<typeof createSessionSchema>;
