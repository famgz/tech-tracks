"use client";

import { Button } from "@/components/ui/button";
import { openEnrollTrackDialog } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  isEnrolled: boolean;
}

export default function EnrollTrackButton({ isEnrolled }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleClick() {
    openEnrollTrackDialog(pathname, searchParams);
  }

  return (
    <Button
      variant={"default"}
      className="min-w-48 gap-2 text-xl font-semibold max-xs:w-full"
      size={"lg"}
      disabled={isEnrolled}
      onClick={handleClick}
    >
      {isEnrolled ? "Matriculado" : "Matricular"}
    </Button>
  );
}
