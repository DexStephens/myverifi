import { z } from "zod";

const passwordSchema = z.string().min(8);
const emailSchema = z.string().min(8);
const issuerSchema = z.object({
  name: z.string(),
  contract_address: z.string(),
  json_uri: z.string(),
});

export class SchemaValidationUtil {
  static LoginSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
  });

  static RegisterSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    address: z.string().optional(),
    issuer: issuerSchema.optional(),
  });
}
