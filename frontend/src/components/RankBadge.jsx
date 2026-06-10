import { Trophy } from 'lucide-react';

export default function RankBadge({ rank, value }) {
  if (!rank || !value) return null;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-yt-bg-tertiary/60 text-yt-text-secondary">
      <Trophy size={10} className={rank <= 3 ? 'text-yt-accent' : 'text-yt-text-muted/50'} />
      #{rank}
    </span>
  );
}
