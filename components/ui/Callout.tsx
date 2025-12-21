import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalloutProps {
  type?: "scripture" | "principle" | "note" | "warning";
  children: ReactNode;
}

export function Callout({ type = "note", children }: CalloutProps) {
  const styles = {
    scripture: "bg-amber-50 border-amber-200 text-amber-900",
    principle: "bg-blue-50 border-blue-200 text-blue-900",
    note: "bg-gray-50 border-gray-200 text-gray-900",
    warning: "bg-red-50 border-red-200 text-red-900",
  };

  const icons = {
    scripture: "📖",
    principle: "💡",
    note: "ℹ️",
    warning: "⚠️",
  };

  return (
    <div className={cn("border-l-4 p-4 my-6 rounded-r-lg", styles[type])}>
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0">{icons[type]}</span>
        <div className="flex-1 prose prose-sm max-w-none">
          {children}
        </div>
      </div>
    </div>
  );
}

