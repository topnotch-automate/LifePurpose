import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Lifeward",
  description:
    "Get in touch with Lifeward. For general inquiries, coaching questions, or information about events.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

