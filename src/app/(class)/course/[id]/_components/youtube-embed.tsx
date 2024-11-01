import React from "react";

export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative flex w-full flex-1 items-center">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        width='100%'
        height='100%'
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
