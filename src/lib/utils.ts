import { fallbackFood } from './constants';

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function formatCurrency(value = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatDate(value?: string) {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function avatarFromName(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=16813a&color=ffffff`;
}

export function imageOrFallback(src?: string) {
  if (!src) {
    return fallbackFood;
  }

  try {
    const url = new URL(src);
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const directImage = /\.(avif|gif|jpe?g|png|webp)$/i.test(url.pathname);

    if (!directImage && (host === 'ibb.co' || host === 'ibb.co.com' || host === 'imgbb.com')) {
      return `/api/images/resolve?url=${encodeURIComponent(src)}`;
    }
  } catch {
    return fallbackFood;
  }

  return src;
}
