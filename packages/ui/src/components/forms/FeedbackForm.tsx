"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, type ZodType } from "zod";

import { Checkbox } from "./Checkbox";
import { FormFieldGroup } from "./FormFieldGroup";
import { FormValidationSummary } from "./FormValidationSummary";
import { Input } from "./Input";
import { Select } from "./Select";
import { Textarea } from "./Textarea";
import { Button } from "../atoms/Button";

const CATEGORY_VALUES = [
  "ACADEMIC",
  "FACILITIES",
  "ADMINISTRATION",
  "GENERAL",
] as const;
export type FeedbackCategory = (typeof CATEGORY_VALUES)[number];

// Default English validation message. Pass a `schema` prop (see
// `buildFeedbackSchema`) with your own translated message to localize this.
export function buildFeedbackSchema(messages?: { message?: string }) {
  return z.object({
    name: z.string().optional(),
    category: z.enum(CATEGORY_VALUES),
    message: z
      .string()
      .min(10, messages?.message ?? "Message must be at least 10 characters"),
    anonymous: z.boolean().optional(),
  });
}

export type FeedbackFormValues = z.infer<
  ReturnType<typeof buildFeedbackSchema>
>;

export interface FeedbackFormLabels {
  name?: string;
  namePlaceholder?: string;
  nameHelperText?: string;
  category?: string;
  categoryOptions?: Record<FeedbackCategory, string>;
  message?: string;
  messagePlaceholder?: string;
  anonymous?: string;
  submit?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface FeedbackFormProps {
  /**
   * Called with validated form data on submit. This component has no
   * knowledge of any API route — the consuming app owns where the data goes.
   * Throw from this callback to show the error state; resolve normally to
   * show the success state.
   */
  onSubmit: (data: FeedbackFormValues) => Promise<void> | void;
  labels?: FeedbackFormLabels;
  /** Override to supply a schema with translated validation messages */
  schema?: ZodType<FeedbackFormValues>;
  className?: string;
}

const DEFAULT_LABELS: Required<FeedbackFormLabels> = {
  name: "Your Name (optional)",
  namePlaceholder: "You can remain anonymous",
  nameHelperText:
    "If you choose to remain anonymous, we won't contact you directly.",
  category: "Category",
  categoryOptions: {
    ACADEMIC: "Academics",
    FACILITIES: "Facilities",
    ADMINISTRATION: "Administration",
    GENERAL: "General",
  },
  message: "Your Feedback",
  messagePlaceholder: "Please share your thoughts, suggestions, or concerns...",
  anonymous: "Submit anonymously (do not store my name)",
  submit: "Submit Feedback",
  successMessage: "Thank you for your feedback!",
  errorMessage: "Submission failed. Please try again.",
};

export function FeedbackForm({
  onSubmit,
  labels,
  schema,
  className,
}: FeedbackFormProps) {
  const resolvedLabels = {
    ...DEFAULT_LABELS,
    ...labels,
    categoryOptions: {
      ...DEFAULT_LABELS.categoryOptions,
      ...labels?.categoryOptions,
    },
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(schema ?? buildFeedbackSchema()),
    defaultValues: { anonymous: false, category: "GENERAL" },
  });

  const categoryOptions = CATEGORY_VALUES.map((value) => ({
    value,
    label: resolvedLabels.categoryOptions[value],
  }));

  const handleFormSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    try {
      await onSubmit(data);
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={className ?? "flex flex-col gap-space-6"}
    >
      <FormValidationSummary
        errors={submitStatus === "error" ? [resolvedLabels.errorMessage] : null}
      />

      <FormFieldGroup>
        <Input
          label={resolvedLabels.name}
          placeholder={resolvedLabels.namePlaceholder}
          {...register("name")}
          error={errors.name?.message}
          helperText={resolvedLabels.nameHelperText}
        />

        <Select
          label={resolvedLabels.category}
          options={categoryOptions}
          {...register("category")}
          error={errors.category?.message}
        />

        <Textarea
          label={resolvedLabels.message}
          placeholder={resolvedLabels.messagePlaceholder}
          rows={5}
          {...register("message")}
          error={errors.message?.message}
        />

        <Checkbox label={resolvedLabels.anonymous} {...register("anonymous")} />
      </FormFieldGroup>

      <Button type="submit" loading={isSubmitting} fullWidth>
        {resolvedLabels.submit}
      </Button>

      {submitStatus === "success" && (
        <p className="text-center text-semantic-success-base font-body text-body-sm">
          {resolvedLabels.successMessage}
        </p>
      )}
    </form>
  );
}
