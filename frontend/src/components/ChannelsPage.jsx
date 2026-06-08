import { useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTheme } from '../context/useTheme';
import { t } from '../i18n';

export default function ChannelsPage({ channels, onRemoveChannel }) {
  const { language } = useTheme();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filteredChannels = channels.filter(ch =>
    ch.toLowerCase().includes(search.toLowerCase())
  );

  function handleConfirmDelete(ch) {
    onRemoveChannel(ch);
    setConfirmDelete(null);
    toast.success(t(language, 'channelRemoved', ch));
  }

  return (
    <div className="space-y-6">
      <div className="bg-yt-bg-card rounded-xl p-4 md:p-6 border border-yt-border">
        <div className="relative mb-4 md:mb-5">
          <Search size={16} className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-yt-text-muted`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t(language, 'searchChannels')}
            className={`w-full bg-yt-input text-yt-text rounded-lg py-2 md:py-2.5 text-sm outline-none focus:ring-2 focus:ring-yt-accent placeholder-yt-text-muted ${language === 'ar' ? 'pr-8 pl-3' : 'pl-8 pr-3'}`}
          />
        </div>

        {channels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-yt-text-muted">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3 opacity-40">
              <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2"/>
              <circle cx="24" cy="26" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M28 24L22 30M22 24L28 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="text-lg" style={{ fontSize: 'var(--font-size-lg)' }}>{t(language, 'noChannels')}</p>
          </div>
        ) : filteredChannels.length === 0 ? (
          <p className="text-yt-text-muted text-sm py-8 text-center">{t(language, 'noSearchResults')}</p>
        ) : (
          <div className="space-y-1">
            {filteredChannels.map(ch => (
              <div key={ch}>
                <div className="flex items-center gap-3 px-3 py-2.5 md:py-3 rounded-lg hover:bg-yt-bg-tertiary/50 transition group">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-yt-accent/20 flex items-center justify-center text-yt-accent text-xs md:text-sm flex-shrink-0 font-bold">
                    {ch.replace('@', '').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-yt-text text-sm md:text-base flex-1 min-w-0 truncate">{ch}</span>
                  {confirmDelete === ch ? (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs text-yt-text-muted">{t(language, 'confirmDelete')}</span>
                      <button
                        onClick={() => handleConfirmDelete(ch)}
                        className="text-xs px-2.5 py-1 rounded bg-yt-accent text-white font-medium hover:bg-yt-accent-hover transition"
                      >
                        {t(language, 'remove')}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs px-2.5 py-1 rounded text-yt-text-secondary hover:bg-yt-bg-tertiary transition"
                      >
                        {t(language, 'cancel')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(ch)}
                      className="text-yt-text-muted hover:text-yt-accent p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      title={t(language, 'remove')}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
