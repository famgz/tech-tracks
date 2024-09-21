import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { User } from "next-auth";

interface Props {
  trackId: string;
  user?: User;
}

export default function TrackBookmarkButton({ trackId, user }: Props) {
  return (
    <Button
      variant={"outline"}
      className="gap-2 border-primary px-6 text-xl max-xs:w-full"
      size={"lg"}
    >
      <BookmarkIcon size={20} /> Salvar
    </Button>
  );
}
