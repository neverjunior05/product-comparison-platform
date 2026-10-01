import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";
import { CheckIcon, InfoIcon, XIcon } from "./Icons";

/** `raised` lifts the stack above the floating compare bar when it's on screen. */
export function Toaster({ raised = false }: { raised?: boolean }) {
  const { toasts, dismiss } = useToast();
  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-[90] flex flex-col items-center gap-2 px-4 transition-[bottom] duration-200 sm:items-end sm:px-6",
        raised ? "bottom-24 sm:bottom-28" : "bottom-4 sm:bottom-6",
      )}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg shadow-slate-900/10 animate-toast-in"
        >
          <span
            className={cn(
              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              t.variant === "success" && "bg-best-100 text-best-700",
              t.variant === "warning" && "bg-amber-100 text-amber-700",
              (!t.variant || t.variant === "default") && "bg-slate-100 text-ink-muted",
            )}
          >
            {t.variant === "success" ? <CheckIcon size={14} strokeWidth={3} /> : <InfoIcon size={14} />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">{t.title}</p>
            {t.description && <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{t.description}</p>}
            {t.action && (
              <button
                onClick={() => {
                  t.action?.onClick();
                  dismiss(t.id);
                }}
                className="mt-2 text-[13px] font-semibold text-brand-600 hover:text-brand-700"
              >
                {t.action.label} →
              </button>
            )}
          </div>
          <button onClick={() => dismiss(t.id)} className="-m-1 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-ink" aria-label="Dismiss">
            <XIcon size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
