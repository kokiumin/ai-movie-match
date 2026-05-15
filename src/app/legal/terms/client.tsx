"use client";
import { useRouter } from "next/navigation";
import { TermsPage } from "@/components/legal/TermsPage";

export function TermsClient({ tab }: { tab: "client" | "creator" }) {
  const router = useRouter();
  return <TermsPage onBack={() => router.push("/")} initialTab={tab} />;
}
