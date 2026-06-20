import { NextResponse } from 'next/server';
import { fallbackFood } from '@/lib/constants';

function extractMetaImage(html: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1].replace(/&amp;/g, '&');
    }
  }

  return '';
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get('url');

  if (!rawUrl) {
    return NextResponse.redirect(fallbackFood);
  }

  try {
    const target = new URL(rawUrl);

    if (!['http:', 'https:'].includes(target.protocol)) {
      return NextResponse.redirect(fallbackFood);
    }

    const response = await fetch(target.toString(), {
      headers: {
        'user-agent': 'Mozilla/5.0 RecipeHub image resolver',
      },
      next: { revalidate: 60 * 60 * 24 },
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.startsWith('image/')) {
      return NextResponse.redirect(target.toString());
    }

    const html = await response.text();
    const imageUrl = extractMetaImage(html);

    if (imageUrl) {
      return NextResponse.redirect(new URL(imageUrl, target).toString());
    }
  } catch {
    return NextResponse.redirect(fallbackFood);
  }

  return NextResponse.redirect(fallbackFood);
}
