export type AnalyticsEvent =
  | 'poema_lido'
  | 'faixa_tocada'
  | 'modo_zen_alterado'
  | 'tema_alterado'
  | 'ebook_pdf_baixado'
  | 'ebook_pdf_oficial_baixado'
  | 'social_card_gerado'
  | 'social_card_compartilhado_nativo'
  | 'verso_sincronizado_clicado';

export function track(evento: AnalyticsEvent, props?: Record<string, unknown>) {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS || 'none';

  if (provider === 'none') {
    // Provedor desativado por padrão: sem rastreamento intrusivo, sem cookies
    return;
  }

  if (provider === 'vercel' && typeof window !== 'undefined') {
    try {
      const windowWithVa = window as unknown as { va?: (type: string, name: string, data?: Record<string, unknown>) => void };
      if (typeof windowWithVa.va === 'function') {
        windowWithVa.va('event', evento, props);
      }
    } catch {
      // Falha silenciosa
    }
  }
}
