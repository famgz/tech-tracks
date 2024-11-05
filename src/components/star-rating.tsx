import { StarIcon } from "lucide-react";

interface Props {
  rating: number;
}

export default function StarRating({ rating }: Props) {
  return (
    <div className="flex items-center">
      {Array.from({ length: rating }).map((_, i) => (
        <StarIcon className="fill-primary/70 text-transparent size-4" key={i} />
      ))}
      {Array.from({ length: 5 - rating }).map((_, i) => (
        <StarIcon className="fill-muted-foreground text-transparent size-4" key={i} />
      ))}
    </div>
  );
}
