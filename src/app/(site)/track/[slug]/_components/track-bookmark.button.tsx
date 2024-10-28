"use client";

import { bookmarkTrack } from "@/actions/user-content";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  trackId: string;
  userId: string;
  isBookmarked: boolean | undefined;
}

export default function BookmarkTrackButton({
  userId,
  trackId,
  isBookmarked,
}: Props) {
  async function handleClick() {
    const res = await bookmarkTrack(userId, trackId);
    res
      ? toast.success("Trilha salva com sucesso!")
      : toast.error("Erro ao salvar a trilha.");
  }

  return (
    <Button
      variant={"outline"}
      className="gap-2 border-primary px-6 text-xl max-xs:w-full"
      size={"lg"}
      onClick={handleClick}
      disabled={isBookmarked}
    >
      <BookmarkIcon size={20} />
      {isBookmarked ? "Salvo" : "Salvar"}
    </Button>
  );
}
