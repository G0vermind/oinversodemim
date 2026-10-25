export function formatDuracao(segundos: number): string {
  if (isNaN(segundos) || segundos < 0) return '00:00';
  const mins = Math.floor(segundos / 60);
  const secs = Math.floor(segundos % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuracaoExtensa(segundos: number): string {
  if (isNaN(segundos) || segundos <= 0) return '0 min';
  const horas = Math.floor(segundos / 3600);
  const mins = Math.floor((segundos % 3600) / 60);
  if (horas > 0) {
    return `${horas}h ${mins.toString().padStart(2, '0')}min`;
  }
  return `${mins} min`;
}

export function formatBRL(centavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(centavos / 100);
}
