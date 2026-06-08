import { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Plus, X } from 'lucide-react';
import { ThemeProvider } from './context/ThemeProvider';
import { useTheme } from './context/useTheme';
import Navbar from './components/Navbar';
import ChannelSidebar from './components/ChannelSidebar';
import HomePage from './components/HomePage';
import ChannelsPage from './components/ChannelsPage';
import SettingsPage from './components/SettingsPage';
import ExportPage from './components/ExportPage';
import { t } from './i18n';

const STORAGE_KEY = 'yt_feed_channels';

function loadChannels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveChannels(channels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
}

function AddChannelModal({ show, onClose, onAdd }) {
  const [input, setInput] = useState('');
  const { language } = useTheme();

  function handleAdd() {
    let handle = input.trim();
    if (!handle) return;

    if (handle.includes('youtube.com') || handle.includes('youtu.be')) {
      const match = handle.match(/@([\w-]+)/);
      if (match) handle = `@${match[1]}`;
      else {
        toast.error(t(language, 'invalidUrl'));
        return;
      }
    }

    if (!handle.startsWith('@')) {
      handle = `@${handle}`;
    }

    onAdd(handle);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleAdd();
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-yt-bg-card rounded-xl p-6 border border-yt-border w-full max-w-md mx-4 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-yt-text text-lg font-bold mb-4">{t(language, 'addChannel')}</h2>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t(language, 'addPlaceholder')}
          className="w-full bg-yt-input text-yt-text rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yt-accent placeholder-yt-text-muted mb-4"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-yt-text-secondary hover:bg-yt-bg-tertiary transition"
          >
            {t(language, 'cancel')}
          </button>
          <button
            onClick={handleAdd}
            className="bg-yt-accent hover:bg-yt-accent-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            {t(language, 'addChannel')}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [channels, setChannels] = useState(loadChannels);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const { language } = useTheme();

  const handleRefreshAll = useCallback(() => {
    setRefreshTrigger(t => t + 1);
  }, []);

  function handleAddChannel(handle) {
    const existing = channels.find(c => c.toLowerCase() === handle.toLowerCase());
    if (existing) {
      toast.error(t(language, 'channelExists'));
      return;
    }
    const updated = [...channels, handle];
    setChannels(updated);
    saveChannels(updated);
    setShowAddModal(false);
    toast.success(t(language, 'channelAdded', handle));
  }

  function handleRemoveChannel(channel) {
    const updated = channels.filter(c => c !== channel);
    setChannels(updated);
    saveChannels(updated);
  }

  const pageTitle = () => {
    switch (activeTab) {
      case 'home': return t(language, 'appTitle');
      case 'channels': return t(language, 'channels');
      case 'settings': return t(language, 'settingsTitle');
      case 'export': return t(language, 'exportTitle');
      default: return '';
    }
  };

  const pageContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomePage
            channels={channels}
            refreshTrigger={refreshTrigger}
            onRefreshAll={handleRefreshAll}
          />
        );
      case 'channels':
        return (
          <ChannelsPage
            channels={channels}
            onRemoveChannel={handleRemoveChannel}
          />
        );
      case 'settings':
        return <SettingsPage />;
      case 'export':
        return <ExportPage channels={channels} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-yt-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
          },
        }}
      />
      <Navbar
        title={pageTitle()}
        onAddChannel={() => setShowAddModal(true)}
      />
      <ChannelSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="md:ms-64 pt-20 px-4 md:px-8 lg:px-12 pb-24 md:pb-8 min-h-screen">
        <div className="max-w-4xl mx-auto pt-2 md:pt-4">
          {pageContent()}
        </div>
      </main>
      <AddChannelModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddChannel}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
