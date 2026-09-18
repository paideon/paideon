import Link from "next/link";
import { type Ref, type ComponentPropsWithoutRef } from "react";

import { cn } from "../../utilities/cn";

type InlineLinkProps = {
  href: string;
  children: React.ReactNode;
  /** Force external link behaviour (target="_blank", rel="noopener noreferrer") */
  external?: boolean;
  /** Prefetch the linked page (Next.js only, ignored for external). Default true. */
  prefetch?: boolean;
  className?: string;
  ref?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "children" | "target" | "rel">;

const inlineLinkStyles = `font-body text-gold-base underline underline-offset-2 
transition-colors duration-fast ease-snap 
hover:text-gold-hover visited:text-gold-active 
focus-visible:outline-2 focus-visible:outline-gold-base focus-visible:outline-offset-[3px]`;

export const InlineLink = ({
  href,
  children,
  external = false,
  prefetch = true,
  className,
  ref,
  ...rest
}: InlineLinkProps) => {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(inlineLinkStyles, className)}
        {...rest}
      >
        {children}
        <span className="sr-only" aria-hidden="false">
          (opens in new tab)
        </span>
      </a>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={cn(inlineLinkStyles, className)}
      {...rest}
    >
      {children}
    </Link>
  );
};

InlineLink.displayName = "InlineLink";
