import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../utils/cn";
import { StarIcon } from "./Icons";

/* ------------------------------------------------------------------ */
/*  Link — hash-router aware anchor                                    */
/* ------------------------------------------------------------------ */
interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string;
}
export function Link({ to, className, children, ...rest }: LinkProps) {
  return (
    <a href={`#${to}`} className={className} {...rest}>
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Button                                                             */
/* ------------------------------------------------------------------ */
type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "best";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none",
  secondary: "bg-ink text-white hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400",
  outline: "border border-slate-200 bg-white text-ink hover:border-slate-300 hover:bg-slate-50 disabled:text-slate-400",
  ghost: "text-ink-muted hover:bg-slate-100 hover:text-ink disabled:text-slate-300",
  danger: "text-rose-600 hover:bg-rose-50 disabled:text-slate-300",
  best: "bg-best-600 text-white hover:bg-best-700",
};
const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-[10px]",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}
export function Button({ variant = "primary", size = "md", icon, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.98] select-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}

/** Same look as Button, rendered as a hash link. */
export function ButtonLink({ to, variant = "primary", size = "md", icon, className, children }: { to: string; variant?: Variant; size?: Size; icon?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-150 active:scale-[0.98] select-none",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {icon}
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Star rating — amber, supports half stars                           */
/* ------------------------------------------------------------------ */
export function StarRating({ value, size = 14, showValue = false, count, className }: { value: number; size?: number; showValue?: boolean; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className="inline-flex items-center gap-px">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i)); // 0..1 fill for this star
          return (
            <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
              <StarIcon size={size} className="absolute inset-0 text-slate-200" />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <StarIcon size={size} className="text-star" />
              </span>
            </span>
          );
        })}
      </span>
      {showValue && <span className="text-[13px] font-semibold text-ink tabular">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-ink-muted tabular">({count.toLocaleString()})</span>}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Badge                                                              */
/* ------------------------------------------------------------------ */
const badgeTone: Record<string, string> = {
  "Editor's Choice": "bg-ink text-white",
  "Best Seller": "bg-brand-500 text-white",
  "Best Value": "bg-best-600 text-white",
  New: "bg-amber-400 text-ink",
};
export function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide", badgeTone[label] ?? "bg-slate-100 text-ink", className)}>
      {label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                    */
/* ------------------------------------------------------------------ */
export function SectionHeading({ eyebrow, title, description, action, className }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {eyebrow && <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">{eyebrow}</p>}
        <h2 className="text-2xl font-bold text-ink sm:text-[28px]">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */
export function EmptyState({ icon, title, description, action, className }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center rounded-card border border-dashed border-slate-200 bg-white px-6 py-14 text-center", className)}>
      {icon && <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">{icon}</div>}
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page container                                                     */
/* ------------------------------------------------------------------ */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}
