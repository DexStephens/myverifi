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

  static retrieveAddressSchema = z.object({
    email: emailSchema,
  });

  static verifyCredentialsSchema = z.object({
    email: emailSchema,
    credential_types: z.array(z.number()),
  });

  static createCredentialSchema = z.object({
    email: emailSchema,
    title: z.string(),
    cid: z.string(),
  });

  static issueCredentialSchema = z.object({
    emails: z.array(emailSchema),
    credential_id: z.number(),
  });

  static updateCredentialSchema = z.object({
    hidden: z.boolean(),
  });
}
