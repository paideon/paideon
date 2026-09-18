import type { AlumniCardData } from "@paideon/contracts";
import Image from "next/image";

import { cn } from "../../utilities/cn";

export interface AlumniCardProps extends AlumniCardData {
  className?: string;
  graduationYearLabel?: string;
  currentRoleLabel?: string;
}

export function AlumniCard({
  id,
  name,
  graduationYear,
  currentRole,
  portrait,
  className,
  graduationYearLabel = "Class of",
  currentRoleLabel = "",
}: AlumniCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-elevated border border-border-light overflow-hidden",
        "shadow-elevation-1 transition-all duration-gentle",
        "hover:shadow-elevation-2 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start gap-space-4 p-space-5">
        <div className="relative h-space-20 w-space-20 shrink-0 overflow-hidden rounded-full bg-green-base border-2 border-border-light">
          {portrait ? (
            <Image
              src={portrait.src}
              alt={portrait.alt ?? name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-3xl italic text-gold-base/30">
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-h3 font-medium text-text-primary mb-space-1 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-space-3 mb-space-2">
            <span className="font-body text-caption uppercase tracking-caption text-text-muted">
              {graduationYearLabel} {graduationYear}
            </span>
            {currentRole && (
              <>
                <span className="text-text-subtle">•</span>
                <span className="font-body text-body-sm text-text-muted truncate">
                  {currentRole}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
