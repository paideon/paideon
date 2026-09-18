"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z, type ZodType } from "zod";

import { FormFieldGroup } from "./FormFieldGroup";
import { Input } from "./Input";
import { Textarea } from "./Textarea";
import { Button } from "../atoms/Button";

// Default English validation messages. Pass a `schema` prop built with your
// own translated messages (see `buildContactSchema`) to localize these.
export function buildContactSchema(messages?: {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}) {
  return z.object({
    name: z.string().min(2, messages?.name ?? "Name is required"),
    email: z.string().email(messages?.email ?? "Valid email is required"),
    subject: z.string().min(3, messages?.subject ?? "Subject is required"),
    message: z
      .string()
      .min(10, messages?.message ?? "Message must be at least 10 characters"),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof buildContactSchema>>;

export interface ContactFormLabels {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  submit?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface ContactFormProps {
  /**
   * Called with validated form data on submit. This component has no
   * knowledge of any API route — the consuming app owns where the data goes
   * (a server action, a fetch call, anything). Throw from this callback to
   * show the error state; resolve normally to show the success state.
   */
  onSubmit: (data: ContactFormValues) => Promise<void> | void;
  labels?: ContactFormLabels;
  /** Override to supply a schema with translated validation messages */
  schema?: ZodType<ContactFormValues>;
  className?: string;
}

const DEFAULT_LABELS: Required<ContactFormLabels> = {
  name: "Full Name",
  email: "Email Address",
  subject: "Subject",
  message: "Message",
  submit: "Send Message",
  successMessage: "Message sent successfully. We'll get back to you soon.",
  errorMessage: "Failed to send. Please try again later.",
};

export function ContactForm({
  onSubmit,
  labels,
  schema,
  className,
}: ContactFormProps) {
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
  } = useForm<ContactFormValues>({
    resolver: zodResolver(schema ?? buildContactSchema()),
  });

  const handleFormSubmit = async (data: ContactFormValues) => {
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
      <FormFieldGroup>
        <Input
          label={resolvedLabels.name}
          {...register("name")}
          error={errors.name?.message}
        />
        <Input
          label={resolvedLabels.email}
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label={resolvedLabels.subject}
          {...register("subject")}
          error={errors.subject?.message}
        />
        <Textarea
          label={resolvedLabels.message}
          rows={5}
          {...register("message")}
          error={errors.message?.message}
        />
      </FormFieldGroup>

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
