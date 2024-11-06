"use client";

import { cn } from "@/lib/utils";
import { StarIcon } from "lucide-react";

interface Props {
  rating: number | null | undefined;
  starClassName?: string;
  fillStars?: boolean;
  onStarClick?: (rating: number) => void;
}

export default function StarRating({
  rating,
  fillStars = true,
  starClassName = "",
  onStarClick,
}: Props) {
  rating = rating || 0;

  function handleStarClick(value: number) {
    if (!onStarClick) return;
    onStarClick(value);
  }

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const currentRating = i + 1;
        return (
          <StarIcon
            className={cn(
              "size-4",
              fillStars ? "text-transparent" : "fill-none",
              { "fill-primary/70": currentRating <= rating && fillStars },
              { "text-primary": currentRating <= rating && !fillStars },
              { "fill-muted-foreground/50": currentRating > rating && fillStars },
              { "text-muted-foreground": currentRating > rating && !fillStars },
              { "cursor-pointer": onStarClick },
              starClassName,
            )}
            key={i}
            strokeWidth={1.5}
            onClick={() => handleStarClick(i + 1)}
          />
        );
      })}
    </div>
  );
}
