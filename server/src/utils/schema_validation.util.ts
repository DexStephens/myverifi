import { z } from "zod";

const passwordSchema = z.string().min(8);

export class SchemaValidationUtil {
  static LoginSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  static WalletRegisterSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
  });

  static WebRegisterSchema = z.object({
    email: z.string().email(),
    password: passwordSchema,
    title: z.string(),
    street_address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string(),
    phone: z.string(),
  });
}
