"use client";

import { enrollUserTrack, isUserAllowedToEnroll } from "@/actions/user-content";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
  async function handleClick() {
    const canEnroll = await isUserAllowedToEnroll(userId);

    if (!canEnroll) {
      toast.error("Limite de matrículas atingido.");
      return;
    }

    const res = await enrollUserTrack(userId, trackId);
    res
      ? toast.success("Trilha matriculada com sucesso!")
      : toast.error("Erro ao matricular a trilha.");
  }

  return (
    <Button
      variant={"default"}
      className="gap-2 text-xl font-semibold max-xs:w-full"
      size={"lg"}
      onClick={handleClick}
      disabled={isEnrolled}
    >
      {isEnrolled ? "Matriculado" : "Matricular-se"}
    </Button>
  );
}
