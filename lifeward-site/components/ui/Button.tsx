import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "text";
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-all min-h-[44px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2";

  const variants = {
    primary: "bg-accent text-background hover:bg-[#6B5D4F]",
    secondary: "border border-accent text-accent hover:bg-accent hover:text-background",
    text: "text-accent hover:text-[#6B5D4F] underline-offset-4 hover:underline",
  };

  const classes = clsx(baseStyles, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

