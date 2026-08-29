import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-gold text-neutral-900 hover:bg-[#a37a09] active:bg-[#8f6c08] disabled:bg-[#4a3c1f] disabled:text-neutral-700",
  secondary:
    "bg-transparent text-gold border border-gold hover:bg-gold/10 active:bg-gold/20 disabled:border-neutral-700 disabled:text-neutral-700",
  ghost:
    "bg-transparent text-neutral-200 hover:bg-neutral-800 active:bg-neutral-700 disabled:text-neutral-700",
  ai: "bg-ai text-white hover:bg-[#7c47ea] active:bg-[#5f2fc2] disabled:bg-[#332049] disabled:text-neutral-700",
};

export default function Button({
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-control px-4 py-2.5 text-small font-semibold font-sans transition-colors disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}
