"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface LanguageOption {
  code: string;
  label: string;
  name: string;
  isSinhala?: boolean;
  isTamil?: boolean;
}

export interface LanguageSwitcherProps {
  locale?: string;
  variant?: "header" | "mobile";
  onDark?: boolean;
  /** Available languages. Defaults to the school's three supported locales. */
  languages?: LanguageOption[];
  /** aria-label builder, e.g. (name) => `Switch to ${name}` — override for translated copy. */
  getSwitchLabel?: (name: string) => string;
}

const DEFAULT_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "si", label: "සිං", name: "Sinhala", isSinhala: true },
  { code: "ta", label: "தமி", name: "Tamil", isTamil: true },
];

export function LanguageSwitcher({
  locale = "en",
  variant = "header",
  onDark = false,
  languages = DEFAULT_LANGUAGES,
  getSwitchLabel = (name: string) => `Switch to ${name}`,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  // Remove the current locale from pathname to build new URLs
  const localeCodes = languages.map((lang) => lang.code).join("|");
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/(${localeCodes})`), "") || "/";

  return (
    <div className="flex items-center gap-1.5">
      {languages.map((lang, idx) => {
        const isActive = locale === lang.code;
        const href = `/${lang.code}${pathWithoutLocale}`;

        return (
          <span key={lang.code} className="flex items-center gap-1.5">
            {idx > 0 && (
              <span
                className={clsx(
                  "text-xs",
                  onDark ? "text-text-inverse/25" : "text-border-default"
                )}
              >
                /
              </span>
            )}
            <Link
              href={href}
              hrefLang={lang.code}
              aria-label={getSwitchLabel(lang.name)}
              className={clsx(
                "transition-colors duration-150",
                lang.isSinhala && "font-sinhala",
                lang.isTamil && "font-body",
                "text-xs uppercase tracking-wide",
                isActive
                  ? clsx(
                      "text-gold-base border-b border-gold-base",
                      variant === "mobile" ? "pb-0.5" : "pb-0.5"
                    )
                  : clsx(
                      onDark
                        ? "text-text-inverse/55 hover:text-gold-base"
                        : "text-text-muted hover:text-gold-base",
                      variant === "mobile" ? "pb-0.5" : "pb-0.5"
                    )
              )}
            >
              {lang.label}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
