"use client";

import Loader from "@/components/loader";
import { useEffect, useState } from "react";

export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [videoId]);

  return (
    <div className="relative flex w-full flex-1 items-center">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`} // &enablejsapi=1
        width="100%"
        height="100%"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoading(false)}
      ></iframe>

      {loading && (
        <div className="absolute inset-0 size-full bg-background/90">
          <Loader />
        </div>
      )}
    </div>
  );
}
