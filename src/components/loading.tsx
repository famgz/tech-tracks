import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex-center h-full w-full flex-1 bg-background/20">
      <LoaderCircleIcon className="size-12 animate-spin stroke-[2px] text-muted-foreground" />
    </div>
  );
}
