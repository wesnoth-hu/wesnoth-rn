import { z } from "zod";

export const loginZodSchema = z
  .object({
    email: z.string().email("Helytelen emailcím formátum"),
    password: z
      .string()
      .min(6, "Legalább 6 karakter hosszúságú jelszót adj meg"),
    confirm: z
      .string()
      .min(6, "Legalább 6 karakter hosszúságú jelszót adj meg"),
  })
  .refine((values) => values.password === values.confirm, {
    message: "A jelszavak nem egyeznek",
    path: ["confirm"],
  });
