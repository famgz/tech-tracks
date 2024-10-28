"use client";

import { enrollTrack, isUserAllowedToEnroll } from "@/actions/user-content";
import { Button, buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { cn } from "@/lib/utils";

interface Props {
  trackId: string;
  userId: string;
  isEnrolled: boolean;
  canEnroll: boolean;
}

export default function EnrollTrackButton({
  userId,
  trackId,
  isEnrolled,
  canEnroll,
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
        {canEnroll ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Matricular-se na trilha</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-0.5">
                  <p>Deseja matricular-se nesta trilha?</p>
                  <p>Você poderá ter acesso ao seu conteúdo.</p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleClick}>
                Matricular
              </AlertDialogAction>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Limite de matrículas atingido</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-0.5">
                  <p>
                    Você já está matriculado em {USER_MAX_TRACK_SLOTS} trilhas.
                  </p>
                  <p>
                    Para gerenciar suas matrículas, acesse sua página de{" "}
                    <Link
                      href={"/user"}
                      className={cn(
                        "inline !h-fit !p-0 !text-foreground",
                        buttonVariants({ variant: "link" }),
                      )}
                    >
                      perfil
                    </Link>
                    .
                  </p>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Voltar</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
