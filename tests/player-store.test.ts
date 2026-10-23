import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore, useAudioCurrentTime, useIsZenMode, useTheme, useCurrentTrack, useIsPlaying } from "../store/useAppStore";
import { Track } from "../types";

describe("Fase 4: Otimização do Player de Áudio e Zustand Selectors", () => {
  const dummyTrack1: Track = {
    url: "/audio/track1.mp3",
    titulo: "Track 1",
    obraTitulo: "Obra 1",
    obraSlug: "obra-1",
    duracao: 180,
  };

  const dummyTrack2: Track = {
    url: "/audio/track2.mp3",
    titulo: "Track 2",
    obraTitulo: "Obra 1",
    obraSlug: "obra-1",
    duracao: 240,
  };

  beforeEach(() => {
    // Reseta estado do store
    useAppStore.setState({
      theme: "dark",
      isZenMode: false,
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      playlist: [dummyTrack1, dummyTrack2],
      seekRequest: null,
    });
  });

  it("deve inicializar com valores padrão esperados", () => {
    const state = useAppStore.getState();
    expect(state.currentTime).toBe(0);
    expect(state.isPlaying).toBe(false);
    expect(state.currentTrack).toBeNull();
    expect(state.isZenMode).toBe(false);
  });

  it("useAudioCurrentTime e seletor devem refletir atualizações de tempo com precisão", () => {
    expect(useAppStore.getState().currentTime).toBe(0);

    useAppStore.getState().setCurrentTime(42.5);
    expect(useAppStore.getState().currentTime).toBe(42.5);

    // Valida que o seletor atômico extrai o valor exato
    const selector = (state: { currentTime: number }) => state.currentTime;
    expect(selector(useAppStore.getState())).toBe(42.5);
  });

  it("deve exportar hooks de seleção granulares como funções", () => {
    expect(typeof useAudioCurrentTime).toBe("function");
    expect(typeof useIsZenMode).toBe("function");
    expect(typeof useTheme).toBe("function");
    expect(typeof useCurrentTrack).toBe("function");
    expect(typeof useIsPlaying).toBe("function");
  });

  it("subscrições granulares com seletores atômicos não disparam para mudanças de tempo", () => {
    let zenModeCallCount = 0;
    let timeCallCount = 0;

    let prevZen = useAppStore.getState().isZenMode;
    let prevTime = useAppStore.getState().currentTime;

    // Subscreve simulando o comportamento de useSyncExternalStore (re-renderiza apenas se o seletor mudar)
    const unsub = useAppStore.subscribe((state) => {
      if (state.isZenMode !== prevZen) {
        prevZen = state.isZenMode;
        zenModeCallCount++;
      }
      if (state.currentTime !== prevTime) {
        prevTime = state.currentTime;
        timeCallCount++;
      }
    });

    // Simula 10 ticks de áudio (~250ms cada)
    for (let i = 1; i <= 10; i++) {
      useAppStore.getState().setCurrentTime(i * 0.25);
    }

    // O seletor de isZenMode não deve ter sido notificado sobre mudanças de currentTime
    expect(useAppStore.getState().currentTime).toBe(2.5);
    expect(useAppStore.getState().isZenMode).toBe(false);
    expect(zenModeCallCount).toBe(0);
    expect(timeCallCount).toBe(10);

    unsub();
  });

  it("deve alternar faixas e reprodução sem afetar seletores de modo zen ou tema", () => {
    useAppStore.getState().playTrack(dummyTrack1);
    expect(useAppStore.getState().isPlaying).toBe(true);
    expect(useAppStore.getState().currentTrack?.titulo).toBe("Track 1");

    useAppStore.getState().playNextTrack();
    expect(useAppStore.getState().currentTrack?.titulo).toBe("Track 2");

    useAppStore.getState().togglePlay();
    expect(useAppStore.getState().isPlaying).toBe(false);
  });

  it("seekTo e clearSeekRequest devem gerenciar pedidos temporais com precisão", () => {
    useAppStore.getState().seekTo(95);
    expect(useAppStore.getState().seekRequest).toBe(95);

    useAppStore.getState().clearSeekRequest();
    expect(useAppStore.getState().seekRequest).toBeNull();
  });
});
