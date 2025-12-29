"use client";

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading" className="text-center">
        <h1 className="text-h1 font-serif font-semibold mb-6">Something went wrong</h1>
        <p className="text-body text-secondary mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={reset}>
            Try Again
          </Button>
          <Button variant="secondary" href="/">
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
}

