import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex-center size-full flex-1 bg-background/20">
      <LoaderCircleIcon className="size-12 animate-spin stroke-[2px] text-muted-foreground" />
    </div>
  );
}
