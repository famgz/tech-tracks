"use client";

import { getUserContent, watchUserContent } from "@/actions/user-content";
import ContentIcon from "@/components/icons/content";
import { cn, isContentVideo } from "@/lib/utils";
import { Content, UserContent } from "@prisma/client";
import { CheckIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  content: Content;
  userId: string;
}

export default function ContentCard({ content, userId }: Props) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const [userContent, setUserContent] = useState<UserContent | null>(null);

  const isCurrentContent = searchParams.get("content") === content.id;
  const isVideo = isContentVideo(content);

  function udpateUrlContent() {
    if (isVideo) {
      params.set("content", content.id);
      replace(`${pathname}?${params.toString()}`);
    }
  }

  async function handleWatchClick() {
    const res = await watchUserContent(userId, content.id);
    setUserContent(res);
  }

  useEffect(() => {
    (async () => {
      const res = await getUserContent(userId, content.id);
      setUserContent(res);
    })();
  }, [userId, content.id]);

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
          {/* check icon */}
          <div
            onClick={handleWatchClick}
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

          <span className="w-9 text-right">{content.duration || "?"}</span>
        </div>
      )}
    </div>
  );
}
