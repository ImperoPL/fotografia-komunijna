import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { contactSchema } from "../schemas/contact";

export const server = {
  submitContact: defineAction({
    accept: "json",
    input: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().min(10),
    }),
    handler: async (input) => {
      // ── PLACEHOLDER ──
      // Server-side validation with Zod Mini (shared schema)
      const parsed = contactSchema.safeParse(input);
      if (!parsed.success) {
        console.error("[submitContact] Validation failed:", parsed.error);
        return { success: false, message: "Błąd walidacji formularza." };
      }

      // TODO: Replace with Resend email integration
      console.log("[submitContact] Form submission received:", parsed.data);

      return {
        success: true,
        message: "Dziękujemy za wiadomość! Skontaktujemy się wkrótce.",
      };
    },
  }),
};
