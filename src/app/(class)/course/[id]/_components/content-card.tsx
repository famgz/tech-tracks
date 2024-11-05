"use client";

import { watchUserContent } from "@/actions/user-content";
import MarkContentWatchedButton from "@/app/(class)/course/[id]/_components/mark-content-watched-button";
import ContentIcon from "@/components/icons/content";
import { cn, isContentVideo } from "@/lib/utils";
import { Content, UserContent } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  content: Content;
  userId: string;
  currentContentId: string | undefined;
  userContentInCourse: UserContent | undefined;
}

export default function ContentCard({
  content,
  userId,
  currentContentId,
  userContentInCourse,
}: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [userContent, setUserContent] = useState<
    UserContent | undefined | null
  >(userContentInCourse);
  const isCurrentContent = currentContentId === content.id;
  const isVideo = isContentVideo(content);

  function udpateUrlContent() {
    if (isVideo) {
      params.set("content", content.id);
      replace(`${pathname}?${params.toString()}`);
    }
  }

  async function handleWatchClick() {
    if (userContent && userContent?.isCompleted) {
      return;
    }
    const res = await watchUserContent(userId, content.id);
    if (res) {
      setUserContent(res);
      toast.success(`Conteúdo ${content.name} marcado como visto`);
    } else {
      toast.error("Erro ao marcar conteúdo como visto");
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-5 border-b bg-background p-4 text-xs font-light hover:bg-background/60",
        {
          "border border-primary/60 font-semibold": isCurrentContent,
          "cursor-not-allowed text-muted-foreground": !isVideo,
        },
      )}
      title={
        !isVideo
          ? "No momento apenas conteúdos de vídeo são suportados na plataforma"
          : ""
      }
    >
      <div
        className="flex flex-1 cursor-pointer items-center gap-3"
        onClick={() => udpateUrlContent()}
      >
        <ContentIcon contentType={content.type} />
        <p className="flex-1 text-left">{content.name}</p>
      </div>

      {isVideo && (
        <div className="flex items-center gap-3">
          <MarkContentWatchedButton
            userContent={userContent}
            handleWatchClick={handleWatchClick}
          />
          <span className="w-9 text-right">{content.duration || "?"}</span>
        </div>
      )}
    </div>
  );
}
