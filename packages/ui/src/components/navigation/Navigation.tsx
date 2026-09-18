"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { LanguageSwitcher, type LanguageOption } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLink } from "./NavLink";
import { cn } from "../../utilities/cn";
import { HStack } from "../layout/Stack";

type NavVariant = "transparent-overlay" | "solid";

// Renamed from `NavLink` (the earlier version shadowed the imported NavLink
// *component* with a same-named local *type*, which is legal TS but easy to
// misread and easy to break during refactors).
interface NavLinkItem {
  label: string;
  href: string;
  children?: NavLinkItem[];
}

export interface NavigationProps {
  variant?: NavVariant;
  /**
   * Nav links. Defaults to an English fallback set below — pass localized
   * links (with locale-prefixed hrefs) from the consuming app for real i18n
   * support; this component does not translate or prefix hrefs itself.
   */
  links?: NavLinkItem[];
  /** Hero bottom offset in px — triggers solid state transition */
  heroHeight?: number;
  locale?: string;
  /** Language options passed through to LanguageSwitcher. Defaults to en/si/ta. */
  languages?: LanguageOption[];
  /** "Apply" CTA button */
  applyLabel?: string;
  applyHref?: string;
  /** Logo lockup text */
  schoolName?: string;
  schoolShortName?: string;
  schoolLocation?: string;
  /** aria-labels */
  homeAriaLabel?: string;
  mainNavAriaLabel?: string;
  openMenuLabel?: string;
  closeMenuLabel?: string;
  /** Passed through to the mobile drawer */
  mobileMenuLabel?: string;
  mobileBackLabel?: string;
}

const DEFAULT_LINKS: NavLinkItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Academics",
    href: "/academics",
    children: [
      { label: "Streams", href: "/academics/streams" },
      { label: "Results", href: "/academics/results" },
    ],
  },
  { label: "News", href: "/news" },
  { label: "Societies", href: "/societies" },
  { label: "Facilities", href: "/facilities" },
  { label: "Admissions", href: "/admissions" },
  { label: "Contact", href: "/contact" },
];

function NavDropdown({ children }: { children: NavLinkItem[] }) {
  return (
    <div className="absolute left-0 top-full z-50 min-w-[180px] border border-border-light bg-surface-elevated py-space-2 shadow-elevation-2">
      {children.map((child) => (
        <NavLink
          key={child.href}
          href={child.href}
          className="px-space-5 py-space-3 font-body text-body uppercase text-text-primary hover:text-gold-base"
        >
          {child.label}
        </NavLink>
      ))}
    </div>
  );
}

function NavItem({
  link,
  isSolid,
  isActive,
}: {
  link: NavLinkItem;
  isSolid: boolean;
  isActive: boolean;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!link.children?.length;

  const textColor = isActive
    ? "text-gold-base"
    : isSolid
    ? "text-text-primary"
    : "text-text-inverse";

  return (
    <div
      className="relative"
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
      onFocus={() => hasChildren && setOpen(true)}
      onBlur={(e) => {
        if (hasChildren && !e.currentTarget.contains(e.relatedTarget as Node))
          setOpen(false);
      }}
    >
      <HStack
        align="center"
        spacing={3}
        className={cn(
          "px-space-8 font-body uppercase hover:text-gold-base",
          textColor
        )}
      >
        <NavLink
          href={link.href}
          aria-expanded={hasChildren ? open : undefined}
          aria-haspopup={hasChildren ? "true" : undefined}
        >
          {link.label}
          {hasChildren && (
            <span className="text-body" aria-hidden="true">
              ▾
            </span>
          )}
          {isActive && <span className="bg-gold-base" />}
        </NavLink>
      </HStack>

      {hasChildren && open && <NavDropdown>{link.children ?? []}</NavDropdown>}
    </div>
  );
}

// ─── Main Navigation ──────────────────────────────────────────────────────────

export function Navigation({
  variant = "solid",
  links = DEFAULT_LINKS,
  heroHeight,
  locale = "en",
  languages,
  applyLabel = "Apply",
  applyHref = "/admissions",
  schoolName = "C.W.W. Kannangara Central College",
  schoolShortName = "KCC",
  schoolLocation = "Mathugama",
  homeAriaLabel,
  mainNavAriaLabel = "Main navigation",
  openMenuLabel = "Open menu",
  closeMenuLabel = "Close menu",
  mobileMenuLabel,
  mobileBackLabel,
}: NavigationProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isOverlay = variant === "transparent-overlay";
  const isSolid = !isOverlay || scrolled;
  const resolvedHomeAriaLabel = homeAriaLabel ?? `${schoolName} — Home`;

  useEffect(() => {
    if (!isOverlay) return;
    const threshold = heroHeight ?? window.innerHeight * 0.7;

    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOverlay, heroHeight]);

  return (
    <>
      <header
        className={cn(
          "transition-colors duration-standard ease-out",
          isOverlay ? "fixed" : "sticky",
          "left-0 right-0 top-0 z-40",
          isSolid
            ? cn(
                "border-b border-border-light bg-surface-base",
                scrolled && "shadow-elevation-1"
              )
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="content-width flex h-[68px] items-center gap-space-10">
          {/* Logo */}
          <NavLink
            href="/"
            className="flex-shrink-0 no-underline"
            aria-label={resolvedHomeAriaLabel}
          >
            <div className="flex items-center gap-space-3">
              <div className="flex h-space-8 w-space-8 items-center justify-center border border-gold-base font-display text-body italic text-gold-base">
                {schoolShortName.charAt(0)}
              </div>
              <div>
                <p className="mb-0.5 font-body text-label uppercase leading-none tracking-label text-gold-base">
                  {schoolShortName}
                </p>
                <p
                  className={cn(
                    "font-body text-label uppercase leading-none tracking-label",
                    isSolid ? "text-text-muted" : "text-text-inverse/50"
                  )}
                >
                  {schoolLocation}
                </p>
              </div>
            </div>
          </NavLink>

          {/* Desktop nav links */}
          <nav
            className="hidden flex-1 items-center gap-space-7 md:flex"
            aria-label={mainNavAriaLabel}
          >
            {links.map((link) => (
              <NavItem
                key={link.href}
                link={link}
                isSolid={isSolid}
                isActive={
                  pathname === link.href || pathname.startsWith(link.href + "/")
                }
              />
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto hidden items-center gap-space-6 md:flex">
            <LanguageSwitcher
              locale={locale}
              variant="header"
              onDark={!isSolid}
              languages={languages}
            />
            <NavLink
              href={applyHref}
              className="flex-shrink-0 bg-gold-base px-space-5 py-space-2.5 font-body text-label uppercase tracking-label text-text-inverse no-underline transition-colors hover:bg-gold-hover"
            >
              {applyLabel}
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="ml-auto flex flex-col gap-1.5 p-space-2 md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label={openMenuLabel}
            aria-expanded={mobileOpen}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn(
                  "block h-[1.5px] w-[22px]",
                  isSolid ? "bg-text-primary" : "bg-text-inverse/85"
                )}
              />
            ))}
          </button>
        </div>
      </header>

      <MobileMenu
        items={links}
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentPath={pathname}
        menuLabel={mobileMenuLabel}
        backLabel={mobileBackLabel}
        closeLabel={closeMenuLabel}
        navLabel={mainNavAriaLabel}
        headerExtra={
          <LanguageSwitcher
            locale={locale}
            variant="mobile"
            onDark
            languages={languages}
          />
        }
        footer={
          <p className="text-center font-body text-label uppercase tracking-label text-text-inverse/20">
            {schoolName}
          </p>
        }
      />
    </>
  );
}

Navigation.displayName = "Navigation";
