"use client";

import { enrollTrack } from "@/actions/user-content";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { USER_MAX_TRACK_SLOTS } from "@/constants/user";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface Props {
  trackId: string;
  isEnrolled: boolean;
  canEnroll: boolean;
}

export default function EnrollTrackDialog({
  trackId,
  isEnrolled,
  canEnroll,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const isOpen = searchParams.get("enrollDialog") === "open";

  function closeDialogWithRouter() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("enrollDialog");
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function closeDialogWithWindow() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("enrollDialog");
    window.history.replaceState({}, "", `${pathname}?${params.toString()}`);
  }

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!canEnroll) {
      return closeDialogWithWindow();
    }

    closeDialogWithRouter();
    const res = await enrollTrack(trackId);
    res
      ? toast.success("Trilha matriculada com sucesso!")
      : toast.error("Erro ao matricular a trilha.");
  }

  if (isEnrolled) return;

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => !open && closeDialogWithWindow()}
    >
      <AlertDialogContent>
        {canEnroll ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Matricular-se na trilha</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-0.5">
                  <p>Deseja matricular-se nesta trilha?</p>
                  <p>Você poderá ter acesso ao seu conteúdo.</p>
                  <p>
                    É possível se matricular em até {USER_MAX_TRACK_SLOTS}{" "}
                    trilhas simultâneas.
                  </p>
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
