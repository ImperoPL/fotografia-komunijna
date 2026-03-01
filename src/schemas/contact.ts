import * as z from "zod/mini";

export const contactSchema = z.object({
  name: z.string().check(z.minLength(2, "Imię musi mieć co najmniej 2 znaki")),
  email: z.email("Podaj prawidłowy adres e-mail"),
  phone: z.string().check(
    z.regex(/^\d{9}$/, "Podaj prawidłowy numer telefonu (9 cyfr)")
  ),
  message: z.string().check(z.minLength(10, "Wiadomość musi mieć co najmniej 10 znaków")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
