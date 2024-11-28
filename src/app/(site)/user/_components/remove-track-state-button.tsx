"use client";

import { unbookmarkTrack, unenrollTrack } from "@/actions/user-content";
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
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  trackId: string;
  type: "enroll" | "bookmark" | "no-action";
}

export default function RemoveTrackStateButton({ trackId, type }: Props) {
  const [open, setOpen] = useState(false);

  async function handleUnenrollClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const res = await unenrollTrack(trackId);
    setOpen(false);
    res
      ? toast.success("Trilha desmatriculada com sucesso")
      : toast.error("Erro ao desmatricular trilha");
  }

  async function handleUnbokmarkClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const res = await unbookmarkTrack(trackId);
    setOpen(false);
    res
      ? toast.success("Trilha removida dos salvos")
      : toast.error("Erro ao remover trilha dos salvos");
  }

  if (type === "no-action") return;

  const isTypeEnroll = type === "enroll";

  const handleClickFunction = isTypeEnroll
    ? handleUnenrollClick
    : handleUnbokmarkClick;

  const title = isTypeEnroll
    ? "Desmatricular-se desta trilha"
    : "Remover trilha dos salvos";

  const message = isTypeEnroll ? (
    <>
      <p>Deseja remover a matricula desta trilha?</p>
      <p>Você poderá rematricular depois caso tenha slots disponíveis.</p>
    </>
  ) : (
    <>
      <p>Deseja remover esta trilha da lista de salvos?</p>
      <p>Você poderá readicioná-la a qualquer momento.</p>
    </>
  );

  return (
    <div onClick={(e) => e.stopPropagation()} role="presentation">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant={"ghost"}
            className="flex-center size-8 rounded-full p-0"
            title={title}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(true);
            }}
          >
            <XIcon className="size-4" strokeWidth={2.5} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-0.5">{message}</div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Cancelar
            </AlertDialogCancel>
            <Button onClick={handleClickFunction} variant={"destructive"}>
              Remover
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
