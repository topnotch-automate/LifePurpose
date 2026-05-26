import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}

export function SectionLabel({ children, className, light }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "font-[family-name:var(--font-label)] text-[10px] uppercase tracking-[0.25em] mb-3",
        light ? "text-[var(--gold-lt)]" : "text-[var(--gold)]",
        className
      )}
    >
      {children}
    </p>
  );
}
