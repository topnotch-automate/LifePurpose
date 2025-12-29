import { ReactNode } from "react";
import clsx from "clsx";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "reading" | "container" | "full";
}

export default function Container({
  children,
  className,
  maxWidth = "container",
}: ContainerProps) {
  const maxWidthClasses = {
    reading: "max-w-reading",
    container: "max-w-container",
    full: "max-w-full",
  };

  return (
    <div
      className={clsx(
        "mx-auto px-4 sm:px-6 lg:px-8",
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}

