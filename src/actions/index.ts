import { defineAction, ActionError } from "astro:actions";
import { z } from "astro/zod";
import { Resend } from "resend";
import { contactSchema } from "../schemas/contact";

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const server = {
  submitContact: defineAction({
    accept: "json",
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().regex(/^\d{9}$/, "Podaj prawidłowy numer telefonu (9 cyfr)"),
      message: z.string().min(10),
    }),
    handler: async (input) => {
      // Server-side validation with Zod Mini (shared schema)
      const parsed = contactSchema.safeParse(input);
      if (!parsed.success) {
        console.error("[submitContact] Validation failed:", parsed.error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Błąd walidacji formularza.",
        });
      }

      const { name, email, phone, message } = parsed.data!;

      // Build plain text version (recommended by Resend for deliverability)
      const textBody = [
        `Nowe zapytanie o sesję komunijną`,
        ``,
        `Imię: ${name}`,
        `E-mail: ${email}`,
        `Telefon: ${phone}`,
        `Wiadomość: ${message}`,
        ``,
        `---`,
        `Wiadomość wysłana z formularza kontaktowego na stronie.`,
      ]
        .filter(Boolean)
        .join("\n");

      // Send notification email to the photographer
      const { data, error } = await resend.emails.send({
        from: "Formularz Kontaktowy <kontakt@kontakt.fotografkomunijny.pl>",
        to: [email],
        subject: `Nowe zapytanie od ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #fdfbf7; border: 1px solid #e8dcc8; border-radius: 8px;">
            <h1 style="color: #b8960c; font-size: 24px; margin-bottom: 24px; border-bottom: 2px solid #e8dcc8; padding-bottom: 12px;">
              ✦ Nowe zapytanie o sesję komunijną
            </h1>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #6b5d3e; vertical-align: top; width: 120px;">Imię:</td>
                <td style="padding: 8px 12px; color: #3d3425;">${name}</td>
              </tr>
              <tr style="background: #f5f0e6;">
                <td style="padding: 8px 12px; font-weight: 600; color: #6b5d3e; vertical-align: top;">E-mail:</td>
                <td style="padding: 8px 12px; color: #3d3425;">
                  <a href="mailto:${email}" style="color: #b8960c;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; font-weight: 600; color: #6b5d3e; vertical-align: top;">Telefon:</td>
                <td style="padding: 8px 12px; color: #3d3425;">
                  <a href="tel:${phone}" style="color: #b8960c;">${phone}</a>
                </td>
              </tr>
              <tr style="background: #f5f0e6;">
                <td style="padding: 8px 12px; font-weight: 600; color: #6b5d3e; vertical-align: top;">Wiadomość:</td>
                <td style="padding: 8px 12px; color: #3d3425; white-space: pre-wrap;">${message}</td>
              </tr>
            </table>
            <p style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e8dcc8; font-size: 12px; color: #9a8b6f;">
              Wiadomość wysłana z formularza kontaktowego na stronie.
            </p>
          </div>
        `,
        text: textBody,
        replyTo: email,
      });

      if (error) {
        console.error("[submitContact] Resend error:", error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Nie udało się wysłać wiadomości. Spróbuj ponownie później.",
        });
      }

      console.log("[submitContact] Email sent:", data?.id);

      return {
        success: true,
        message: "Dziękujemy za wiadomość! Skontaktujemy się wkrótce.",
      };
    },
  }),
};
