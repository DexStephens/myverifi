import { z } from "zod";

const passwordSchema = z.string().min(8);
const emailSchema = z.string().min(8);

export class SchemaValidationUtil {
  static LoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  static RegisterSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: z.string().optional(),
  });

  static updateAddressSchema = z.object({
    email: emailSchema,
    address: z.string(),
  });
}
