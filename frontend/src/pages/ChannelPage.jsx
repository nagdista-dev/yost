import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, X, LayoutGrid, List, ChevronDown } from 'lucide-react';
import api from '../api';
import VideoCard from '../components/VideoCard';
import VideoSkeleton from '../components/VideoSkeleton';
import VideoPlayerModal from '../components/VideoPlayerModal';
const SORT_OPTIONS = ['newest', 'views'];

export default function ChannelPage({ channelHandle, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(null);
  const [listMode, setListMode] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      try {
        const res = await api.get('/api/channel-videos', { params: { channelHandle } });
        if (!cancelled) setData(res.data);
      } catch {
        if (!cancelled) setData(null);
      }
      if (!cancelled) setLoading(false);
    }
    fetchData();
    return () => { cancelled = true; };
  }, [channelHandle]);

  const avatarLetter = (data?.channelName || channelHandle).replace('@', '').charAt(0).toUpperCase();

  const processedVideos = useMemo(() => {
    if (!data?.videos) return [];
    let list = data.videos.map(v => ({
      ...v,
      _channelHandle: data.channelHandle,
    }));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(v => v.title.toLowerCase().includes(q));
    }
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.published) - new Date(a.published));
    } else if (sortBy === 'views') {
      list.sort((a, b) => (parseInt(b.views) || 0) - (parseInt(a.views) || 0));
    }
    return list;
  }, [data, search, sortBy]);

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-yt-text-muted hover:text-yt-text transition text-sm"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {loading ? (
        <>
          <div className="bg-yt-bg-card rounded-xl border border-yt-border/50 p-5 md:p-6 flex items-center gap-4 animate-pulse">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yt-bg-tertiary shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-yt-bg-tertiary rounded w-1/3" />
              <div className="h-3 bg-yt-bg-tertiary rounded w-1/5" />
            </div>
          </div>
          <div className={listMode ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5'}>
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoSkeleton key={i} list={listMode} />
            ))}
          </div>
        </>
      ) : !data ? (
        <div className="text-center text-yt-text-muted py-20 text-sm">Could not load channel.</div>
      ) : (
        <>
          <div className="bg-yt-bg-card rounded-xl border border-yt-border/50 p-5 md:p-6 flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-yt-accent/20 flex items-center justify-center text-yt-accent text-xl md:text-2xl font-bold shrink-0">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <h1 className="text-yt-text text-xl md:text-2xl font-bold truncate">
                {data.channelName}
              </h1>
              <p className="text-yt-text-muted text-sm mt-0.5">{data.channelHandle}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[160px] max-w-xs">
                <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none text-yt-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full ps-9 pe-8 py-2 text-xs rounded-lg border border-yt-border/40 bg-yt-bg-tertiary/50 text-yt-text-secondary outline-none focus:ring-2 focus:ring-yt-accent"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute end-2 top-1/2 -translate-y-1/2 text-yt-text-muted hover:text-yt-text"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none px-3 py-2 pr-8 text-xs rounded-lg border border-yt-border/40 bg-yt-bg-tertiary/50 text-yt-text-secondary outline-none focus:ring-2 focus:ring-yt-accent cursor-pointer font-medium"
                >
                  {SORT_OPTIONS.map(key => (
                    <option key={key} value={key}>{key === 'newest' ? 'Newest' : 'Most Viewed'}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute end-2 top-1/2 -translate-y-1/2 pointer-events-none text-yt-text-muted" />
              </div>

              <div className="ms-auto flex items-center gap-1 bg-yt-bg-tertiary/50 rounded-lg p-0.5 border border-yt-border/40">
                <button
                  onClick={() => setListMode(false)}
                  className={`p-1.5 rounded-md transition ${
                    !listMode ? 'bg-yt-accent text-white shadow-sm' : 'text-yt-text-secondary hover:text-yt-text'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setListMode(true)}
                  className={`p-1.5 rounded-md transition ${
                    listMode ? 'bg-yt-accent text-white shadow-sm' : 'text-yt-text-secondary hover:text-yt-text'
                  }`}
                  title="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {processedVideos.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-0.5">
                <p className="text-xs text-yt-text-muted">
                  {search
                    ? `${processedVideos.length} of ${data.videos.length} videos`
                    : `${processedVideos.length} videos`
                  }
                </p>
              </div>
              <div className={listMode ? 'space-y-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5'}>
                {processedVideos.map(video => (
                  <VideoCard
                    key={video.videoId}
                    video={video}
                    list={listMode}
                    ranks={{}}
                    onPlay={(id) => setPlaying(id)}
                    onChannelClick={onBack}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center text-yt-text-muted py-20 text-sm">
              {search ? 'No videos match your search.' : 'No videos found.'}
            </div>
          )}
        </>
      )}

      {playing && (
        <VideoPlayerModal
          videoId={playing}
          onClose={() => setPlaying(null)}
        />
      )}
    </div>
  );
}
