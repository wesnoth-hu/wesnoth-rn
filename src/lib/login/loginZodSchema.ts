import { z } from "zod";

const Base = z
  .object({
    email: z
      .string({
        required_error: "Az emailcím nem maradhat el",
      })
      .email("Helytelen emailcím formátum"),
    username: z
      .string({
        invalid_type_error: "A felhasználónév helytelen karaktereket tartalmaz",
        required_error: "A felhasználónév nem maradhat el",
      })
      .min(3, "Legalább 3 karakter hosszú felhasználnevet adj meg"),
    password: z
      .string({ required_error: "A jelszó nem maradhat el" })
      .min(6, "Legalább 6 karakter hosszúságú jelszót adj meg"),
    confirm: z
      .string({ required_error: "A jelszó nem maradhat el" })
      .min(6, "Legalább 6 karakter hosszúságú jelszót adj meg"),
  })
  .partial();

export const loginZodSchema = Base.required({
  password: true,
  confirm: true,
}).refine((values) => values.password === values.confirm, {
  message: "A jelszavak nem egyeznek",
  path: ["confirm"],
});
