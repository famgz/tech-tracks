"use client";

import {
  isUserAllowedToEnroll,
  unbookmarkTrack,
  unenrollTrack,
} from "@/actions/user-content";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

interface Props {
  userId: string;
  trackId: string;
  type: "enroll" | "bookmark" | "no-action";
}

export default function RemoveTrackStateButton({
  userId,
  trackId,
  type,
}: Props) {
  async function handleUnenrollClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const res = await unenrollTrack(userId, trackId);
    res
      ? toast.success("Trilha desmatriculada com sucesso")
      : toast.error("Erro ao desmatricular trilha");
  }

  async function handleUnbokmarkClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const res = await unbookmarkTrack(userId, trackId);
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

  return (
    <Button
      variant={"ghost"}
      onClick={handleClickFunction}
      className="flex-center size-8 rounded-full p-0"
      title={title}
    >
      <XIcon className="size-4" strokeWidth={2.5} />
    </Button>
  );
}
