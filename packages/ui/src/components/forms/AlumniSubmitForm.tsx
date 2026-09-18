"use client";

// packages/ui/src/components/forms/AlumniSubmitForm.tsx
//
// F-180's public submission form — a visitor adding themselves to the
// Alumni Directory's moderation queue. Same shape as ContactForm.tsx and
// FeedbackForm.tsx: this component has no knowledge of any API route or
// tRPC — the consuming app (`apps/web/src/blocks/alumni/
// SubmitProfileBlock.tsx`) owns where the data actually goes.
//
// Deliberately does NOT include a portrait upload field — the Media
// Library's presigned-upload flow (see modules/media/router.ts) is
// admin-only by design (F-067), and a second, public-facing upload path is
// real new scope (abuse surface, storage cost, moderation of uploaded
// images) beyond what this form covers. An admin can attach a portrait
// when they review and approve the submission.
//
// Includes a honeypot field (`website`) as a first line of defence against
// simple form-filling bots: rendered as a real, focusable-by-tab-order-
// skipped input a sighted human never sees or fills, but visible to a bot
// that blindly fills every field it finds. If it's non-empty on submit,
// this component fakes the success state and never calls `onSubmit` at
// all — the bot gets no signal that anything about its submission was
// rejected, and the real submit path never even runs. This is a
// deliberately modest defence, not a complete one: a bot that skips
// rendering the form entirely and calls the underlying mutation directly
// bypasses it completely, same as it would bypass any client-side check.
// The real safety boundary against that is server-side — `submitProfile`
// in modules/alumni/service.ts forces every submission to PENDING
// regardless of input, so nothing can self-publish onto the directory
// even if this component's honeypot is skipped entirely. See that
// function's own header note for the full reasoning, including why no
// rate limiting exists yet.

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, type ZodType } from "zod";

import { FormFieldGroup } from "./FormFieldGroup";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { Button } from "../atoms/Button";

// Default English validation messages — pass a `schema` prop built with
// your own translated messages to localize these, same convention as
// `buildContactSchema`/`buildFeedbackSchema`.
export function buildAlumniSubmitSchema(messages?: {
  name?: string;
  graduationYear?: string;
  quote?: string;
}) {
  return z.object({
    name: z.string().min(2, messages?.name ?? "Name is required"),
    graduationYear: z
      .string()
      .min(4, messages?.graduationYear ?? "Graduation year is required")
      .max(9, messages?.graduationYear ?? "Graduation year is required"),
    stream: z.string().optional(),
    currentRole: z.string().optional(),
    currentOrg: z.string().optional(),
    quote: z
      .string()
      .max(280, messages?.quote ?? "Quote must be 280 characters or fewer")
      .optional(),
    // Honeypot — see this file's header note. Left out of
    // `AlumniSubmitValues` below deliberately; a human's submission never
    // carries this field past `handleFormSubmit`.
    website: z.string().optional(),
  });
}

export type AlumniSubmitFormValues = z.infer<
  ReturnType<typeof buildAlumniSubmitSchema>
>;
export type AlumniSubmitValues = Omit<AlumniSubmitFormValues, "website">;

export interface AlumniSubmitFormLabels {
  name?: string;
  namePlaceholder?: string;
  graduationYear?: string;
  graduationYearPlaceholder?: string;
  stream?: string;
  streamUnknown?: string;
  currentRole?: string;
  currentOrg?: string;
  quote?: string;
  submit?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface AlumniSubmitFormProps {
  /**
   * Called with validated, honeypot-stripped form data on submit. This
   * component has no knowledge of any API route — the consuming app owns
   * where the data goes (a server action, a fetch call, anything). Throw
   * from this callback to show the error state; resolve normally to show
   * the success state.
   */
  onSubmit: (data: AlumniSubmitValues) => Promise<void> | void;
  /** A/L stream options — passed in rather than imported from
   * `@paideon/contracts` directly within this component so the value/label
   * pairs stay the caller's choice (e.g. localized labels), matching how
   * `apps/admin/src/app/alumni/AlumniForm.tsx`'s own stream select is
   * built from the same `ALStreamEnum.options`. */
  streamOptions: { value: string; label: string }[];
  labels?: AlumniSubmitFormLabels;
  /** Override to supply a schema with translated validation messages. */
  schema?: ZodType<AlumniSubmitFormValues>;
  className?: string;
}

const DEFAULT_LABELS: Required<AlumniSubmitFormLabels> = {
  name: "Full Name",
  namePlaceholder: "e.g. Kamal Perera",
  graduationYear: "Graduation Year",
  graduationYearPlaceholder: "e.g. 2020",
  stream: "Stream",
  streamUnknown: "— Unknown —",
  currentRole: "Current Role",
  currentOrg: "Organization",
  quote: "A short quote (optional)",
  submit: "Submit Profile",
  successMessage:
    "Thank you! Your profile has been submitted and will appear once reviewed.",
  errorMessage: "Failed to submit. Please try again later.",
};

export function AlumniSubmitForm({
  onSubmit,
  streamOptions,
  labels,
  schema,
  className,
}: AlumniSubmitFormProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AlumniSubmitFormValues>({
    resolver: zodResolver(schema ?? buildAlumniSubmitSchema()),
  });

  const handleFormSubmit = async (data: AlumniSubmitFormValues) => {
    // Honeypot tripped — a sighted human never fills this field. Fake the
    // success state without ever calling `onSubmit`; see this file's
    // header note for why.
    if (data.website) {
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    const { website: _website, ...values } = data;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      await onSubmit(values);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const streamSelectOptions = [
    { value: "", label: resolvedLabels.streamUnknown },
    ...streamOptions,
  ];

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={className ?? "flex flex-col gap-space-6"}
    >
      <FormFieldGroup>
        <Input
          label={resolvedLabels.name}
          placeholder={resolvedLabels.namePlaceholder}
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label={resolvedLabels.graduationYear}
          placeholder={resolvedLabels.graduationYearPlaceholder}
          {...register("graduationYear")}
          error={errors.graduationYear?.message}
        />
        <Select
          label={resolvedLabels.stream}
          options={streamSelectOptions}
          {...register("stream")}
          error={errors.stream?.message}
        />
        <Input
          label={resolvedLabels.currentRole}
          {...register("currentRole")}
          error={errors.currentRole?.message}
        />
        <Input
          label={resolvedLabels.currentOrg}
          {...register("currentOrg")}
          error={errors.currentOrg?.message}
        />
        <Textarea
          label={resolvedLabels.quote}
          rows={3}
          {...register("quote")}
          error={errors.quote?.message}
        />
      </FormFieldGroup>

      {/* Honeypot — visually and semantically hidden from a sighted human
       * (off-screen, `aria-hidden`, excluded from tab order) but present
       * in the DOM for a bot that fills every field it finds. Real
       * `label`+`id` pairing kept intact so this doesn't read as a fake
       * field to anything inspecting the DOM structure itself, only to
       * something that renders and understands CSS. */}
      <div
        aria-hidden="true"
        className="absolute h-px w-px overflow-hidden opacity-0"
        style={{ left: "-9999px" }}
      >
        <label htmlFor="alumni-submit-website">Leave this field blank</label>
        <input
          id="alumni-submit-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <Button type="submit" loading={isSubmitting} fullWidth>
        {resolvedLabels.submit}
      </Button>

      {submitStatus === "success" && (
        <p className="text-center text-semantic-success-base font-body text-body-sm">
          {resolvedLabels.successMessage}
        </p>
      )}
      {submitStatus === "error" && (
        <p className="text-center text-semantic-error-base font-body text-body-sm">
          {resolvedLabels.errorMessage}
        </p>
      )}
    </form>
  );
}
