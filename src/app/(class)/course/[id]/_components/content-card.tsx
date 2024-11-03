"use client";

import ContentIcon from "@/components/icons/content";
import { cn, isContentVideo } from "@/lib/utils";
import { Content } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  content: Content;
}

export default function ContentCard({ content }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const isCurrentContent = searchParams.get("content") === content.id;
  const isVideo = isContentVideo(content);

  function udpateUrlContent() {
    if (isVideo) {
      params.set("content", content.id);
      replace(`${pathname}?${params.toString()}`);
    }
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-3 border-b bg-background p-4 text-xs font-light hover:bg-background/70",
        {
          "border border-foreground font-semibold text-primary":
            isCurrentContent,
          "cursor-not-allowed text-muted-foreground": !isVideo,
        },
      )}
      onClick={() => udpateUrlContent()}
      title={
        !isVideo
          ? "No momento apenas conteúdos de vídeo são suportados na plataforma"
          : ""
      }
    >
      <ContentIcon contentType={content.type} />

      <p className="flex-1 text-left">{content.name}</p>

      {isVideo && <span>{content.duration || "?"}</span>}
    </div>
  );
}
