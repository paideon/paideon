// ─── Quick Access Portal Links ─────────────────────────────────────────────────

import Link from "next/link";

import { cn } from "../../utilities/cn";

export interface PortalLink {
  label: string;
  href: string;
  /** Simple SVG icon path — default icons provided */
  iconPath?: string;
}

export interface QuickAccessPortalProps {
  links?: PortalLink[];
}

const DEFAULT_PORTAL_LINKS: PortalLink[] = [
  {
    label: "For Students",
    href: "/portal/students",
    iconPath:
      "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z",
  },
  {
    label: "For Parents",
    href: "/portal/parents",
    iconPath:
      "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    label: "For Staff",
    href: "/portal/staff",
    iconPath:
      "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    label: "Alumni",
    href: "/alumni",
    iconPath:
      "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
];

export function QuickAccessPortal({
  links = DEFAULT_PORTAL_LINKS,
}: QuickAccessPortalProps) {
  return (
    <div className="bg-surface-deep border-b border-border-light">
      <div className="content-width">
        {/* Desktop: horizontal strip */}
        <div className="hidden md:flex items-stretch">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-1 items-center justify-center gap-space-2 py-space-3 px-space-6",
                "font-body text-label uppercase tracking-label text-text-muted no-underline",
                "transition-colors duration-fast hover:text-gold-base",
                i < links.length - 1 && "border-r border-border-light"
              )}
            >
              {/* Icon */}
              {link.iconPath && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={link.iconPath} />
                </svg>
              )}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile: 2×2 grid */}
        <div className="md:hidden grid grid-cols-2 border-t border-border-light">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-space-2 py-space-3.5 px-space-4",
                "font-body text-label-sm uppercase tracking-label-sm text-text-muted no-underline",
                i % 2 === 0 && "border-r border-border-light",
                i < links.length - 2 && "border-b border-border-light"
              )}
            >
              {link.iconPath && (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={link.iconPath} />
                </svg>
              )}
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
