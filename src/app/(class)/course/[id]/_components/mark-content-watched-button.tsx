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
import { cn } from "@/lib/utils";
import { UserContent } from "@prisma/client";
import { CheckIcon } from "lucide-react";

interface Props {
  userContent: UserContent | null | undefined;
  handleWatchClick: () => void;
}

export default function MarkContentWatchedButton({
  userContent,
  handleWatchClick,
}: Props) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <div
          className={cn(
            "flex-center size-4 cursor-pointer rounded-full border border-foreground",
            {
              "border-primary/10 bg-primary/70": userContent?.isCompleted,
            },
          )}
        >
          {userContent && userContent?.isCompleted && (
            <CheckIcon className="size-3 text-background" strokeWidth={4.5} />
          )}
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          {userContent && userContent?.isCompleted ? (
            <>
              <AlertDialogTitle>Conteúdo já visto</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-0.5">
                  <p>Este conteúdo já está marcado como visto.</p>
                  <p>Esta ação é irreversível.</p>
                </div>
              </AlertDialogDescription>
            </>
          ) : (
            <>
              <AlertDialogTitle>Marcar conteúdo como visto</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <div className="space-y-0.5">
                  <p>Deseja marcar este conteúdo como visto?</p>
                  <p>Esta ação é irreversível.</p>
                </div>
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          {!(userContent && userContent?.isCompleted) && (
            <AlertDialogAction onClick={handleWatchClick}>
              Salvar
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
