import React from "react";
import { ArrowRight } from "lucide-react";

// The site's one call-to-action component (point 10 of documentation/final-polish-v2.0.md):
// three variants, two sizes, one corner radius. Every CTA on the site goes through it, so a
// button can't drift into its own colour, radius or weight again.
//  - primary:   solid brass — one per view, for "Start a Project" or the view's main action
//  - secondary: neutral outline — everything else, including WhatsApp and Email (with an icon)
//  - link:      text plus an arrow
export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "md" | "sm";

interface OwnProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon, e.g. MessageSquare for WhatsApp. */
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  /** Trailing arrow. On by default for the `link` variant only. */
  arrow?: boolean;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

type AnchorProps = OwnProps & {
  href: string;
  /** Opens in a new tab (WhatsApp, social profiles, PDFs). */
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof OwnProps | "href">;

type NativeButtonProps = OwnProps & { href?: undefined } & Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    keyof OwnProps
  >;

export type ButtonProps = AnchorProps | NativeButtonProps;

const BASE =
  "group inline-flex items-center justify-center gap-2 font-sans font-semibold whitespace-nowrap " +
  "transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-amber-400 disabled:opacity-60 disabled:cursor-not-allowed";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "rounded bg-amber-400 text-neutral-950 hover:bg-amber-300",
  // A translucent dark fill, so the same button reads on the page, over video and over images.
  secondary: "rounded border border-neutral-600 bg-neutral-950/60 text-neutral-100 backdrop-blur-sm hover:border-neutral-300 hover:bg-neutral-900",
  link: "text-amber-400 hover:text-amber-300",
};

const BOX_SIZES: Record<ButtonSize, string> = {
  md: "min-h-12 px-6 py-3 text-small",
  sm: "min-h-10 px-4 py-2 text-label",
};

const LINK_SIZES: Record<ButtonSize, string> = {
  md: "text-small",
  sm: "text-label",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  arrow,
  fullWidth = false,
  className = "",
  children,
  ...rest
}) => {
  const showArrow = arrow ?? variant === "link";
  const iconClass = size === "sm" ? "w-3.5 h-3.5 shrink-0" : "w-4 h-4 shrink-0";
  const classes = [
    BASE,
    VARIANTS[variant],
    variant === "link" ? LINK_SIZES[size] : BOX_SIZES[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon && <Icon className={iconClass} aria-hidden="true" />}
      <span>{children}</span>
      {showArrow && (
        <ArrowRight
          className={`${iconClass} transition-transform duration-200 group-hover:translate-x-0.5`}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (rest.href !== undefined) {
    const { external, ...anchor } = rest as Omit<AnchorProps, keyof OwnProps>;
    return (
      <a {...anchor} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={classes}>
        {content}
      </a>
    );
  }

  const { type, ...button } = rest as Omit<NativeButtonProps, keyof OwnProps>;
  return (
    <button {...button} type={type ?? "button"} className={classes}>
      {content}
    </button>
  );
};
