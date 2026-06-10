import { Film, Eye, Heart, MessageCircle, ThumbsDown, Clock, TrendingUp, Trophy, Play } from 'lucide-react';
import RankBadge from './RankBadge';
import StatCell from './StatCell';

function formatViews(raw) {
  if (!raw || raw === '0') return '';
  const n = parseInt(raw, 10);
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'K';
  return n.toLocaleString();
}

function timeAgo(iso, lang) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const diff = Date.now() - d.getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day}d ago`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week}w ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month}mo ago`;
  const year = Math.floor(day / 365);
  return `${year}y ago`;
}

function engagementRate(likes, views) {
  const l = parseInt(likes, 10);
  const v = parseInt(views, 10);
  if (!v || !l) return null;
  return ((l / v) * 100).toFixed(1);
}

function dislikePercentage(likes, dislikes) {
  const l = parseInt(likes, 10);
  const d = parseInt(dislikes, 10);
  if (!l && !d) return null;
  const total = l + d;
  if (!total) return null;
  return ((d / total) * 100).toFixed(1);
}

function GridCard({ video, ranks, onPlay }) {
  const r = ranks || {};
  const ratio = engagementRate(video.likes, video.views);
  const ago = timeAgo(video.published);
  const dislikePct = dislikePercentage(video.likes, video.dislikes);
  const commentsFormatted = formatViews(video.comments);
  const dislikesFormatted = formatViews(video.dislikes);

  return (
    <div className="group bg-yt-bg-card rounded-xl border border-yt-border shadow-sm hover:shadow-xl hover:border-yt-accent/20 transition-all duration-300 overflow-hidden flex flex-col">
      <div
        className="aspect-video bg-yt-bg-tertiary overflow-hidden relative cursor-pointer"
        onClick={() => onPlay(video.videoId)}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-yt-text-muted/30">
            <Film size={48} />
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-yt-accent/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={28} className="text-white ml-0.5" />
          </div>
        </div>

        {r.viewsRank && r.viewsRank <= 3 && (
          <div className="absolute top-2 left-2 bg-yt-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1">
            <Trophy size={10} /> #{r.viewsRank}
          </div>
        )}

        {ago && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-medium backdrop-blur-sm flex items-center gap-1">
            <Clock size={10} />
            {ago}
          </span>
        )}
      </div>

      <div className="p-3 md:p-4 flex flex-col gap-2.5 flex-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-yt-text font-semibold text-sm leading-snug line-clamp-2 group-hover:text-yt-accent transition-colors duration-200">
            {video.title || 'Untitled'}
          </h3>
          <p className="text-yt-text-muted text-xs mt-1 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-yt-bg-tertiary flex items-center justify-center text-[8px] font-bold text-yt-text-muted">
              {(video._channelName || '?')[0].toUpperCase()}
            </span>
            {video._channelName}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 py-2 border-t border-b border-yt-border/30">
          <StatCell icon={<Eye size={12} />} value={formatViews(video.views) || '0'} label="Views" highlight={r.viewsRank && r.viewsRank <= 3} />
          <StatCell icon={<Heart size={12} />} value={formatViews(video.likes) || '0'} label="Likes" highlight={r.likesRank && r.likesRank <= 3} className="border-x border-yt-border/30" />
          <StatCell icon={<MessageCircle size={12} />} value={commentsFormatted || '\u2014'} label="Comments" />
          <StatCell icon={<TrendingUp size={12} />} value={ratio ? `${ratio}%` : '\u2014'} label="Engagement" className="text-emerald-500" />
        </div>

        {dislikePct !== null && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-yt-text-muted">
              <span className="flex items-center gap-1">
                <ThumbsDown size={10} className="text-red-400" />
                {dislikesFormatted || '0'}
              </span>
              <span className="font-medium text-red-400">{dislikePct}%</span>
            </div>
            <div className="w-full h-1.5 bg-yt-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-red-500 transition-all duration-300"
                style={{ width: `${dislikePct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <RankBadge rank={r.viewsRank} value={video.views} />
          <RankBadge rank={r.likesRank} value={video.likes} />
        </div>
      </div>
    </div>
  );
}

function ListCard({ video, ranks, onPlay }) {
  const r = ranks || {};
  const ratio = engagementRate(video.likes, video.views);
  const ago = timeAgo(video.published);
  const dislikePct = dislikePercentage(video.likes, video.dislikes);
  const commentsFormatted = formatViews(video.comments);
  const dislikesFormatted = formatViews(video.dislikes);

  return (
    <div className="group bg-yt-bg-card rounded-xl border border-yt-border shadow-sm hover:shadow-lg hover:border-yt-accent/20 transition-all duration-300 overflow-hidden flex gap-4 p-3">
      <div
        className="w-36 sm:w-44 h-20 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-yt-bg-tertiary relative cursor-pointer"
        onClick={() => onPlay(video.videoId)}
      >
        {video.thumbnail ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-yt-text-muted/30"><Film size={24} /></div>
        )}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-yt-accent/90 flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={18} className="text-white ml-0.5" />
          </div>
        </div>
        {ago && (
          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-medium backdrop-blur-sm flex items-center gap-0.5">
            <Clock size={8} />
            {ago}
          </span>
        )}
        {r.viewsRank && r.viewsRank <= 3 && (
          <span className="absolute top-1 left-1 bg-yt-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
            #{r.viewsRank}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 gap-1">
        <div>
          <h3 className="text-yt-text font-semibold text-sm leading-snug line-clamp-1 group-hover:text-yt-accent transition-colors">
            {video.title || 'Untitled'}
          </h3>
          <p className="text-yt-text-muted text-xs mt-0.5 flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-full bg-yt-bg-tertiary flex items-center justify-center text-[6px] font-bold text-yt-text-muted">
              {(video._channelName || '?')[0].toUpperCase()}
            </span>
            {video._channelName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-yt-text-muted text-xs">
          <span className="flex items-center gap-1"><Eye size={11} />{formatViews(video.views) || '0'}</span>
          {video.likes && <span className="flex items-center gap-1"><Heart size={11} />{formatViews(video.likes)}</span>}
          {commentsFormatted && <span className="flex items-center gap-1"><MessageCircle size={11} />{commentsFormatted}</span>}
          {ratio && <span className="flex items-center gap-1 text-emerald-500"><TrendingUp size={11} />{ratio}%</span>}
          {dislikePct !== null && <span className="flex items-center gap-1 text-red-400"><ThumbsDown size={11} />{dislikePct}%</span>}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <RankBadge rank={r.viewsRank} value={video.views} />
          <RankBadge rank={r.likesRank} value={video.likes} />
        </div>
      </div>
    </div>
  );
}

export default function VideoCard({ video, list, ranks, onPlay }) {
  if (list) return <ListCard video={video} ranks={ranks} onPlay={onPlay} />;
  return <GridCard video={video} ranks={ranks} onPlay={onPlay} />;
}
