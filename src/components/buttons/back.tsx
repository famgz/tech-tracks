"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  backUrl?: string;
}

export default function BackButton({ backUrl }: Props) {
  const router = useRouter();

  function handleBack() {
    if (backUrl) {
      return router.push(backUrl);
    }
    if (window.history.length > 1) {
      return router.back();
    }
    router.push("/");
  }

  return (
    <Button
      className="shrink-0 rounded-full"
      variant={"secondary"}
      size={"icon"}
      onClick={handleBack}
    >
      <ChevronLeftIcon strokeWidth={2} />
    </Button>
  );
}
