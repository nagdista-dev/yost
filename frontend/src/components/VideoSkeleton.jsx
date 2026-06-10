export default function VideoSkeleton({ list }) {
  return (
    <div className={`bg-yt-bg-card rounded-2xl border border-yt-border overflow-hidden animate-pulse ${list ? 'flex gap-4 p-3' : ''}`}>
      <div className={`bg-yt-bg-tertiary ${list ? 'w-40 h-24 shrink-0 rounded-xl' : 'aspect-video'}`} />
      <div className={`space-y-2 ${list ? 'flex-1 py-1' : 'p-4'}`}>
        <div className="h-4 bg-yt-bg-tertiary rounded w-3/4" />
        <div className="h-3 bg-yt-bg-tertiary rounded w-1/2" />
        <div className="flex gap-4 mt-3">
          <div className="h-3 bg-yt-bg-tertiary rounded w-16" />
          <div className="h-3 bg-yt-bg-tertiary rounded w-16" />
        </div>
      </div>
    </div>
  );
}
