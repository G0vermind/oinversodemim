'use client';

import { usePathname } from 'next/navigation';
import { Suspense, ReactNode, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { GlobalAudioPlayer } from '../audio/GlobalAudioPlayer';
import { LyricsPanel } from '../audio/LyricsPanel';

function SiteShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isKeystatic = pathname?.startsWith('/keystatic');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('Registro do Service Worker:', err);
      });
    }
  }, []);

  if (isKeystatic) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <>
      <Suspense fallback={<div className="h-16 border-b border-linha/60 bg-superficie" />}>
        <Header />
      </Suspense>
      <main className="flex-1 pt-16 pb-28 sm:pb-24">
        {children}
      </main>
      <Footer />
      <GlobalAudioPlayer />
      <LyricsPanel />
    </>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<main className="flex-1 pt-16 pb-28 sm:pb-24">{children}</main>}>
      <SiteShellContent>{children}</SiteShellContent>
    </Suspense>
  );
}
