import { useForm } from "@tanstack/react-form";
import { actions } from "astro:actions";
import { useState } from "react";

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setSubmitStatus(null);
        const { data, error } = await actions.submitContact(value);

        if (error) {
          setSubmitStatus({
            type: "error",
            message: "Wystąpił błąd. Spróbuj ponownie później.",
          });
          return;
        }

        if (data?.success) {
          setSubmitStatus({ type: "success", message: data.message });
          form.reset();
        } else {
          setSubmitStatus({
            type: "error",
            message: data?.message ?? "Wystąpił nieoczekiwany błąd.",
          });
        }
      } catch {
        setSubmitStatus({
          type: "error",
          message: "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
        });
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Name */}
      <form.Field
        name="name"
        validators={{
          onBlur: ({ value }) =>
            value.length < 2 ? "Imię musi mieć co najmniej 2 znaki" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label
              htmlFor="name"
              className="block font-display text-lg font-medium text-gold"
            >
              Imię i nazwisko
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Jan Kowalski"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full rounded-md border border-gold-pale bg-white px-4 py-3 font-body text-text placeholder:text-text-light/50 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && field.state.value.length < 2 && (
              <p className="text-sm text-red-600">
                {[...new Set(field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message ?? ''))].join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Email */}
      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }) =>
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Podaj prawidłowy adres e-mail" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block font-display text-lg font-medium text-gold"
            >
              Adres e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jan@example.com"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full rounded-md border border-gold-pale bg-white px-4 py-3 font-body text-text placeholder:text-text-light/50 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.state.value) && (
              <p className="text-sm text-red-600">
                {[...new Set(field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message ?? ''))].join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Phone */}
      <form.Field
        name="phone"
        validators={{
          onBlur: ({ value }) =>
            !/^\d{9}$/.test(value) ? "Podaj prawidłowy numer telefonu (9 cyfr)" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block font-display text-lg font-medium text-gold"
            >
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="123456789"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full rounded-md border border-gold-pale bg-white px-4 py-3 font-body text-text placeholder:text-text-light/50 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && !/^\d{9}$/.test(field.state.value) && (
              <p className="text-sm text-red-600">
                {[...new Set(field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message ?? ''))].join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Message */}
      <form.Field
        name="message"
        validators={{
          onBlur: ({ value }) =>
            value.length < 10 ? "Wiadomość musi mieć co najmniej 10 znaków" : undefined,
        }}
      >
        {(field) => (
          <div className="space-y-1">
            <label
              htmlFor="message"
              className="block font-display text-lg font-medium text-gold"
            >
              Wiadomość
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Opisz czego szukasz — termin, miejsce uroczystości, miejce przyjęcia komunijnego..."
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="w-full resize-y rounded-md border border-gold-pale bg-white px-4 py-3 font-body text-text placeholder:text-text-light/50 transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {field.state.meta.isTouched && field.state.meta.errors?.length > 0 && field.state.value.length < 10 && (
              <p className="text-sm text-red-600">
                {[...new Set(field.state.meta.errors.map((e: any) => typeof e === 'string' ? e : e?.message ?? ''))].join(', ')}
              </p>
            )}
          </div>
        )}
      </form.Field>

      {/* Submit status */}
      {submitStatus && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            submitStatus.type === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      {/* Submit button */}
      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="group relative w-full cursor-pointer overflow-hidden rounded-md bg-gold px-8 py-4 font-display text-lg font-semibold tracking-wide text-white transition-all duration-300 hover:bg-gold-accent hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="relative z-10">
              {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gold-accent transition-transform duration-500 group-hover:translate-x-0" />
          </button>
        )}
      </form.Subscribe>
    </form>
  );
}
