import { useEffect, useState, useMemo, useCallback } from 'react';
import { Film, LayoutGrid, List } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import api from '../api';
import { t } from '../i18n';
import VideoCard from '../components/VideoCard';
import VideoSkeleton from '../components/VideoSkeleton';
import VideoPlayerModal from '../components/VideoPlayerModal';

const GRID_COLUMNS = [1, 2, 3, 4];
const SORT_OPTIONS = ['newest', 'views', 'likes', 'comments', 'dislikes', 'ratio'];

export default function VideosPage({ channels }) {
  const { language } = useTheme();
  const [videos, setVideos] = useState({});
  const [loading, setLoading] = useState(true);
  const [listMode, setListMode] = useState(false);
  const [columns, setColumns] = useState(3);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const allCategories = [...new Set(channels.map(ch => ch.category).filter(Boolean))];

  useEffect(() => {
    if (channels.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      setLoading(true);
      const results = {};

      const promises = channels.map(async (ch) => {
        const handle = typeof ch === 'string' ? ch : ch.handle;
        try {
          const { data } = await api.get('/api/latest-video', { params: { channelHandle: handle } });
          if (!cancelled && data.video) {
            results[handle] = {
              ...data.video,
              _channelName: ch.name || ch.handle.replace('@', ''),
              _channelHandle: handle,
              _channelCategory: ch.category,
            };
          }
        } catch {}
      });

      await Promise.allSettled(promises);

      if (!cancelled) {
        setVideos(results);
        setLoading(false);
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [channels]);

  const videoList = useMemo(() => {
    const filtered = Object.values(videos).filter(v => !categoryFilter || v._channelCategory === categoryFilter);

    let sorted;
    switch (sortBy) {
      case 'views':
        sorted = [...filtered].sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0));
        break;
      case 'likes':
        sorted = [...filtered].sort((a, b) => (parseInt(b.likes) || 0) - (parseInt(a.likes) || 0));
        break;
      case 'comments':
        sorted = [...filtered].sort((a, b) => (parseInt(b.comments) || 0) - (parseInt(a.comments) || 0));
        break;
      case 'dislikes':
        sorted = [...filtered].sort((a, b) => (parseInt(b.dislikes) || 0) - (parseInt(a.dislikes) || 0));
        break;
      case 'ratio': {
        const ratio = (v) => {
          const l = parseInt(v.likes, 10);
          const w = parseInt(v.views, 10);
          return w ? l / w : 0;
        };
        sorted = [...filtered].sort((a, b) => ratio(b) - ratio(a));
        break;
      }
      default:
        sorted = [...filtered].sort((a, b) => {
          const da = a.published ? new Date(a.published).getTime() : 0;
          const db = b.published ? new Date(b.published).getTime() : 0;
          return db - da;
        });
    }

    const byViews = [...sorted].sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0));
    const byLikes = [...sorted].sort((a, b) => (parseInt(b.likes) || 0) - (parseInt(a.likes) || 0));

    const viewsRankMap = {};
    const likesRankMap = {};
    byViews.forEach((v, i) => { viewsRankMap[v.videoId] = i + 1; });
    byLikes.forEach((v, i) => { likesRankMap[v.videoId] = i + 1; });

    return sorted.map(v => ({
      ...v,
      _viewsRank: viewsRankMap[v.videoId] || null,
      _likesRank: likesRankMap[v.videoId] || null,
    }));
  }, [videos, categoryFilter, sortBy]);

  const handlePlay = useCallback((videoId) => {
    setPlayingVideoId(videoId);
  }, []);

  if (channels.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-yt-text-muted">
        <p className="text-lg md:text-xl" style={{ fontSize: 'var(--font-size-lg)' }}>{t(language, 'noChannels')}</p>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  const sortLabel = (key) => {
    switch (key) {
      case 'newest': return t(language, 'sortNewest');
      case 'views': return t(language, 'sortViews');
      case 'likes': return t(language, 'sortLikes');
      case 'comments': return t(language, 'sortComments');
      case 'dislikes': return t(language, 'sortDislikes');
      case 'ratio': return t(language, 'sortRatio');
      default: return key;
    }
  };

  return (
    <div className="space-y-4 md:space-y-5">
      <div className="flex items-center gap-3 flex-wrap">
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCategoryFilter(null)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition ${!categoryFilter ? 'bg-yt-accent text-white border-yt-accent' : 'bg-yt-bg-tertiary/50 text-yt-text-secondary border-yt-border/40 hover:border-yt-accent/50'}`}
            >
              {t(language, 'allCategories')}
            </button>
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg border transition ${categoryFilter === cat ? 'bg-yt-accent text-white border-yt-accent' : 'bg-yt-bg-tertiary/50 text-yt-text-secondary border-yt-border/40 hover:border-yt-accent/50'}`}
              >
                {cat === 'Unspecified' ? t(language, 'unspecified') : cat}
              </button>
            ))}
          </div>
        )}

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-2.5 py-1.5 text-xs rounded-lg border border-yt-border/40 bg-yt-bg-tertiary/50 text-yt-text-secondary outline-none focus:ring-2 focus:ring-yt-accent appearance-none cursor-pointer"
        >
          {SORT_OPTIONS.map(key => (
            <option key={key} value={key}>{sortLabel(key)}</option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-1 bg-yt-bg-tertiary/50 rounded-lg p-0.5 border border-yt-border/40">
          {!listMode && GRID_COLUMNS.map(n => (
            <button
              key={n}
              onClick={() => setColumns(n)}
              className={`px-2 py-1 rounded-md text-xs font-medium transition ${columns === n ? 'bg-yt-accent text-white' : 'text-yt-text-secondary hover:text-yt-text'}`}
              title={`${n} cols`}
            >
              {n}
            </button>
          ))}
          <span className="w-px h-4 bg-yt-border/40 mx-0.5" />
          <button
            onClick={() => setListMode(false)}
            className={`p-1.5 rounded-md transition ${!listMode ? 'bg-yt-accent text-white' : 'text-yt-text-secondary hover:text-yt-text'}`}
            title="Grid"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setListMode(true)}
            className={`p-1.5 rounded-md transition ${listMode ? 'bg-yt-accent text-white' : 'text-yt-text-secondary hover:text-yt-text'}`}
            title="List"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className={listMode ? 'space-y-3' : `grid ${gridCols[columns]} gap-4 md:gap-5`}>
          {Array.from({ length: Math.min(channels.length, 6) }).map((_, i) => (
            <VideoSkeleton key={i} list={listMode} />
          ))}
        </div>
      ) : videoList.length === 0 ? (
        <div className="text-center text-yt-text-muted py-16">
          <Film size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg" style={{ fontSize: 'var(--font-size-lg)' }}>{t(language, 'noVideos')}</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-yt-text-muted">{t(language, 'showingVideos', videoList.length)}</p>
          <div className={listMode ? 'space-y-3' : `grid ${gridCols[columns]} gap-4 md:gap-5`}>
            {videoList.map((video) => (
              <VideoCard
                key={video.videoId}
                video={video}
                list={listMode}
                ranks={{ viewsRank: video._viewsRank, likesRank: video._likesRank }}
                onPlay={handlePlay}
              />
            ))}
          </div>
        </>
      )}

      {playingVideoId && (
        <VideoPlayerModal
          videoId={playingVideoId}
          onClose={() => setPlayingVideoId(null)}
        />
      )}
    </div>
  );
}
