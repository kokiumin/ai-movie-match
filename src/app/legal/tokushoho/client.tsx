"use client";
import { useRouter } from "next/navigation";
import { TokushohoPage } from "@/components/legal/TokushohoPage";

export function TokushohoClient() {
  const router = useRouter();
  return <TokushohoPage onBack={() => router.push("/")} />;
}
