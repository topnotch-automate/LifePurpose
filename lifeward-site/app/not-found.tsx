import Container from "@/components/ui/Container";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="py-12 md:py-16 lg:py-20">
      <Container maxWidth="reading" className="text-center">
        <h1 className="text-h1 font-serif font-semibold mb-6">404</h1>
        <p className="text-body text-secondary mb-8">
          The page you are looking for does not exist.
        </p>
        <Button href="/" variant="primary">
          Return Home
        </Button>
      </Container>
    </div>
  );
}

