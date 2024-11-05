import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface Props {
  rating: number;
  starClassName?: string;
}

export default function StarRating({ rating, starClassName = "" }: Props) {
  return (
    <div className="flex items-center">
      {Array.from({ length: rating }).map((_, i) => (
        <StarIcon
          className={cn("size-4 fill-primary/70 text-transparent")}
          key={i}
          strokeWidth={0.51}
        />
      ))}
      {Array.from({ length: 5 - rating }).map((_, i) => (
        <StarIcon
          className={cn(
            "size-4 fill-muted-foreground text-transparent",
            starClassName,
          )}
          key={i}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
