import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

interface Props {
  isFilled: boolean;
}

export default function PlayIcon({ isFilled }: Props) {
  return (
    <div
      className={cn(
        "flex-center size-7 shrink-0 rounded-full",
        isFilled ? "bg-primary" : "border border-muted-foreground",
      )}
    >
      <Play
        className={cn("size-4 fill-background", {
          "text-transparent": isFilled,
        })}
        strokeWidth={1}
      />
    </div>
  );
}
