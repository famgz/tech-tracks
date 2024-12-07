"use client";

import { feedbackUserTrack } from "@/actions/user-content";
import StarRating from "@/components/star-rating";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Track, UserTrack } from "@prisma/client";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface Props {
  userTrack: UserTrack;
  track: Track;
}

export default function FeedbackButton({ userTrack, track }: Props) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState(userTrack.comment || "");
  const [rating, setRating] = useState(userTrack.rating);
  const [liked, setLiked] = useState(userTrack.liked);

  function handleOpenChange() {
    setComment(userTrack.comment || "");
    setRating(userTrack.rating);
    setLiked(userTrack.liked);
    setOpen((prev) => !prev);
  }

  const canSubmit = useMemo(
    () => comment.trim().length >= 5 || (rating && rating > 0),
    [comment, rating],
  );

  async function handleSendFeedback() {
    if (!(comment || rating)) {
      toast.error("Comentário ou avaliação inválido");
      return;
    }

    if (comment && comment.length < 5) {
      toast.error("Comentário precisa ter no mínimo 5 caracteres.");
      return;
    }

    const data = {
      comment,
      rating,
      liked: true,
    };

    try {
      const res = await feedbackUserTrack(userTrack.trackId, data);
      if (res) {
        toast.success("Feedback enviado com sucesso");
        setOpen(false);
      } else {
        throw new Error();
      }
    } catch (e) {
      toast.error("Erro ao enviar feedback");
    }
  }

  if (!userTrack) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger>
        <div className="flex-center mx-auto flex-col gap-2 text-muted-foreground">
          <p>Seu Feedback</p>
          <StarRating
            rating={userTrack.rating}
            fillStars={false}
            starClassName="size-8"
          />
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Enviar Feedback</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-0.5">
              <p>
                Enviar feedback para a trilha{" "}
                <span className="font-bold">{track.name}</span>
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Comentários
            </label>
            <Textarea
              placeholder="O que achou desta trilha?"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="font-light max-sm:text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="liked"
                checked={!!liked}
                onCheckedChange={(checked: CheckedState) =>
                  setLiked(checked === true)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Gostou?
              </label>
            </div>

            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Avaliação</h3>
              <StarRating
                rating={rating}
                starClassName="size-6"
                fillStars={true}
                onStarClick={setRating}
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button onClick={handleSendFeedback} disabled={!canSubmit}>
            Salvar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
