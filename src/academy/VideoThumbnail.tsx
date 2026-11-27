import { useState } from "react";
import { Film } from "lucide-react";

const VIDEO_THUMBNAIL_SIZES = ["hqdefault", "mqdefault", "default"] as const;

/**
 * Loads a visible YouTube-style preview immediately. If a particular size is
 * missing, it steps down to a smaller image before showing a designed fallback.
 */
export function VideoThumbnail({
  youtubeId,
  title,
  priority = false,
}: {
  youtubeId: string;
  title: string;
  priority?: boolean;
}) {
  const [source, setSource] = useState(0);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="academy-video-thumbnail-fallback" aria-hidden="true">
        <Film size={28} />
        <span>{title}</span>
      </span>
    );
  }

  return (
    <img
      src={`https://i.ytimg.com/vi/${youtubeId}/${VIDEO_THUMBNAIL_SIZES[source]}.jpg`}
      alt=""
      loading="eager"
      decoding="async"
      ref={(image) => {
        image?.setAttribute("fetchpriority", priority ? "high" : "auto");
      }}
      referrerPolicy="no-referrer"
      onError={() => {
        if (source < VIDEO_THUMBNAIL_SIZES.length - 1) {
          setSource(source + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
