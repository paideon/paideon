"use client";

import type { ProcessStepsData } from "@paideon/contracts";
import { clsx } from "clsx";

export interface ProcessStepsProps {
  steps: ProcessStepsData["steps"];
  className?: string;
}

export function ProcessSteps({ steps, className }: ProcessStepsProps) {
  return (
    <div className={clsx("relative", className)}>
      {/* Vertical connector line */}
      <div className="absolute left-6 top-8 bottom-8 w-px bg-border-light md:left-1/2 md:-translate-x-1/2" />

      <div className="space-y-12">
        {steps.map((step, idx) => (
          <div
            key={step.id}
            className={clsx(
              "relative flex flex-col md:flex-row gap-6",
              idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            )}
          >
            {/* Step number circle */}
            <div className="flex-none">
              <div className="w-12 h-12 rounded-full bg-green-base text-text-inverse flex items-center justify-center font-display text-xl font-semibold relative z-10">
                {step.step}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 bg-surface-elevated border border-border-light rounded-lg p-6 shadow-elevation-1">
              <h3 className="font-display text-h3 mb-2">{step.title}</h3>
              <p className="font-body text-body text-text-muted">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
