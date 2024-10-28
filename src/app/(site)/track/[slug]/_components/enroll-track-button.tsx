"use client";

import { enrollTrack, isUserAllowedToEnroll } from "@/actions/user-content";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
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
import { useState } from "react";

interface Props {
  trackId: string;
  userId: string;
  isEnrolled: boolean | undefined;
}

export default function EnrollTrackButton({
  userId,
  trackId,
  isEnrolled,
}: Props) {
  const [open, setOpen] = useState(false);

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const canEnroll = await isUserAllowedToEnroll(userId);

    if (!canEnroll) {
      setOpen(false);
      toast.error("Limite de matrículas atingido.");
      return;
    }

    const res = await enrollTrack(userId, trackId);
    setOpen(false);
    res
      ? toast.success("Trilha matriculada com sucesso!")
      : toast.error("Erro ao matricular a trilha.");
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={"default"}
          className="gap-2 text-xl font-semibold max-xs:w-full"
          size={"lg"}
          disabled={isEnrolled}
        >
          {isEnrolled ? "Matriculado" : "Matricular-se"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Matricular-se na trilha</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <p>Deseja matricular-se nesta trilha?</p>
              <p>Você poderá ter acesso ao seu conteúdo.</p>
            </div>
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
