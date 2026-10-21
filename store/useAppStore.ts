import { create } from 'zustand';
import { Track } from '../types';

export type Theme = 'dark' | 'light';

export type ReaderFontSize = 'normal' | 'large' | 'xlarge';
export type ReaderAtmosphere = 'default' | 'sepia' | 'oled';

interface AppState {
  // Tema
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Letra
  isLyricsOpen: boolean;
  openLyrics: () => void;
  closeLyrics: () => void;

  // Player
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  playlist: Track[];
  currentTime: number;
  seekRequest: number | null;
  setPlaylist: (tracks: Track[]) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  playNextTrack: () => void;
  playPrevTrack: () => void;
  setCurrentTime: (t: number) => void;
  seekTo: (seconds: number) => void;
  clearSeekRequest: () => void;

  // Modo Zen
  isZenMode: boolean;
  toggleZenMode: () => void;
  setZenMode: (v: boolean) => void;

  // Favoritos Poéticos
  favoritos: string[];
  initFavoritos: () => void;
  toggleFavorito: (poemaId: string) => void;
  isFavorito: (poemaId: string) => boolean;

  // Preferências do Leitor (Atmosfera & Tamanho)
  readerFontSize: ReaderFontSize;
  readerAtmosphere: ReaderAtmosphere;
  setReaderFontSize: (size: ReaderFontSize) => void;
  setReaderAtmosphere: (atm: ReaderAtmosphere) => void;
  initReaderPreferences: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Tema
  theme: 'dark',
  setTheme: (newTheme: Theme) => {
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = newTheme;
      try {
        localStorage.setItem('tema', newTheme);
      } catch {
        // Ignora erros de localStorage
      }
    }
    set({ theme: newTheme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark';
      if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = nextTheme;
        try {
          localStorage.setItem('tema', nextTheme);
        } catch {
          // Ignora erros de localStorage
        }
      }
      return { theme: nextTheme };
    });
  },

  // Letra
  isLyricsOpen: false,
  openLyrics: () => set({ isLyricsOpen: true }),
  closeLyrics: () => set({ isLyricsOpen: false }),

  // Player
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  playlist: [],
  currentTime: 0,
  seekRequest: null,
  setPlaylist: (tracks: Track[]) => set({ playlist: tracks }),
  playTrack: (track: Track) =>
    set((state) => {
      if (state.currentTrack?.url === track.url && state.currentTrack.titulo === track.titulo) {
        return { isPlaying: true };
      }
      return { currentTrack: track, isPlaying: true };
    }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (v: number) => set({ volume: Math.max(0, Math.min(1, v)) }),
  playNextTrack: () => {
    const { playlist, currentTrack } = get();
    if (!playlist.length || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.titulo === currentTrack.titulo);
    const nextIndex = (currentIndex + 1) % playlist.length;
    set({ currentTrack: playlist[nextIndex], isPlaying: true });
  },
  playPrevTrack: () => {
    const { playlist, currentTrack } = get();
    if (!playlist.length || !currentTrack) return;
    const currentIndex = playlist.findIndex((t) => t.titulo === currentTrack.titulo);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    set({ currentTrack: playlist[prevIndex], isPlaying: true });
  },
  setCurrentTime: (t: number) => set({ currentTime: t }),
  seekTo: (seconds: number) => set({ seekRequest: seconds }),
  clearSeekRequest: () => set({ seekRequest: null }),

  // Modo Zen
  isZenMode: false,
  toggleZenMode: () => set((state) => ({ isZenMode: !state.isZenMode })),
  setZenMode: (v: boolean) => set({ isZenMode: v }),

  // Favoritos Poéticos
  favoritos: [],
  initFavoritos: () => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("inverso_favoritos");
        if (saved) {
          set({ favoritos: JSON.parse(saved) });
        }
      } catch {}
    }
  },
  toggleFavorito: (poemaId: string) => {
    set((state) => {
      const exists = state.favoritos.includes(poemaId);
      const next = exists
        ? state.favoritos.filter((id) => id !== poemaId)
        : [...state.favoritos, poemaId];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("inverso_favoritos", JSON.stringify(next));
        } catch {}
      }
      return { favoritos: next };
    });
  },
  isFavorito: (poemaId: string) => get().favoritos.includes(poemaId),

  // Preferências do Leitor (Atmosfera & Tamanho)
  readerFontSize: 'normal',
  readerAtmosphere: 'default',
  setReaderFontSize: (size: ReaderFontSize) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('inverso_reader_fontsize', size);
      } catch {}
    }
    set({ readerFontSize: size });
  },
  setReaderAtmosphere: (atm: ReaderAtmosphere) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('inverso_reader_atmosphere', atm);
      } catch {}
    }
    set({ readerAtmosphere: atm });
  },
  initReaderPreferences: () => {
    if (typeof window !== 'undefined') {
      try {
        const savedSize = localStorage.getItem('inverso_reader_fontsize') as ReaderFontSize;
        const savedAtm = localStorage.getItem('inverso_reader_atmosphere') as ReaderAtmosphere;
        if (savedSize && ['normal', 'large', 'xlarge'].includes(savedSize)) {
          set({ readerFontSize: savedSize });
        }
        if (savedAtm && ['default', 'sepia', 'oled'].includes(savedAtm)) {
          set({ readerAtmosphere: savedAtm });
        }
      } catch {}
    }
  },
}));
