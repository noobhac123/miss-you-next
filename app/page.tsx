import type { Metadata } from 'next';
import { headers } from 'next/headers';
import MissYouApp from '@/app/ui';

type QueryValue = string | string[] | undefined;
type Props = { searchParams: Promise<Record<string, QueryValue>> };

const first = (value: QueryValue) => (Array.isArray(value) ? value[0] : value) ?? '';
const clean = (value: string, max: number) => value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = await searchParams;
  const from = clean(first(q.from), 40);
  const to = clean(first(q.to), 40);
  const msg = clean(first(q.msg), 180);
  const h = await headers();
  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || (host.startsWith('localhost') ? 'http' : 'https');
  const base = (process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`).replace(/\/$/, '');
  const pageUrl = new URL('/', base);
  for (const key of ['from', 'to', 'msg', 'ref', 'parent']) {
    const value = first(q[key]);
    if (value) pageUrl.searchParams.set(key, clean(value, key === 'msg' ? 180 : 80));
  }
  const imageQuery = new URLSearchParams();
  if (from) imageQuery.set('from', from);
  if (to) imageQuery.set('to', to);
  if (msg) imageQuery.set('msg', msg);
  if (first(q.ref)) imageQuery.set('ref', clean(first(q.ref), 80));
  const imageUrl = `${base}/api/og?${imageQuery.toString()}`;
  const title = from ? `${from} sent you a little note 💌` : 'A little note for someone special 💌';
  const description = from
    ? `${from}${to ? ` made this note for ${to}` : ' made you a little note'}. Open it, then send one to someone special.`
    : 'Make a beautiful Miss You card and pass the feeling on.';
  return {
    title,
    description,
    alternates: { canonical: pageUrl.toString() },
    openGraph: {
      type: 'website',
      siteName: 'Miss You',
      title,
      description,
      url: pageUrl.toString(),
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${from || 'Someone special'}’s Miss You message card` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  };
}

export default async function Page({ searchParams }: Props) {
  const q = await searchParams;
  const initial = {
    from: clean(first(q.from), 40),
    to: clean(first(q.to), 40),
    msg: clean(first(q.msg), 180),
    ref: clean(first(q.ref), 80),
    parent: clean(first(q.parent), 80),
  };
  return <MissYouApp initial={initial} />;
}
