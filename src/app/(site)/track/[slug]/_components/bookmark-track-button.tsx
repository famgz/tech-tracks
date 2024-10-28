"use client";

import { bookmarkTrack } from "@/actions/user-content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { BookmarkIcon } from "lucide-react";
import { useState } from "react";
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
  const [open, setOpen] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const res = await bookmarkTrack(userId, trackId);
    setOpen(false);
    res
      ? toast.success("Trilha salva com sucesso!")
      : toast.error("Erro ao salvar a trilha.");
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"outline"}
          className="gap-2 border-primary px-6 text-xl max-xs:w-full"
          size={"lg"}
          disabled={isBookmarked}
        >
          <BookmarkIcon size={20} />
          {isBookmarked ? "Salvo" : "Salvar"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Salvar trilha</AlertDialogTitle>
          <AlertDialogDescription>
            Desejar incluir esta trilha na lista de salvos?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Salvar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
