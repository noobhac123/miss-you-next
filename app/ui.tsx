'use client';

import { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowRight, Check, Copy, Heart, Mail, MessageCircle,
  Send, Sparkles, WandSparkles, X, Instagram, Facebook,
} from 'lucide-react';

type Initial = { from: string; to: string; msg: string; ref: string; parent: string };
const DEFAULT_MESSAGE = 'No matter how far apart we are, you are always in my thoughts. Hope I get to see you soon. 💗';
const PRESETS = [
  { label: 'I miss you', text: 'I miss you more than words can say. Hope we make a beautiful memory together soon. ♡' },
  { label: 'Thinking of you', text: 'Just a little reminder that you matter to me. Sending you a little happiness today. ✨' },
  { label: 'Best friend', text: 'Life feels better with you in it. Thank you for being the kind of friend who feels like home. 💗' },
  { label: 'Long distance', text: 'Miles can keep us apart, but never out of my thoughts. Until we meet again, take care. ♡' },
  { label: 'Just because', text: 'No special reason. I just wanted you to know I am really glad you are in my life. ♡' },
  { label: 'Thank you', text: 'Thank you for showing up, making me laugh, and making ordinary days feel special. 🌷' },
];
const MONETAG_LINK = process.env.NEXT_PUBLIC_MONETAG_DIRECT_LINK || '';
const trim = (value: string, max: number) => value.replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);

export default function MissYouApp({ initial }: { initial: Initial }) {
  const received = Boolean(initial.from || initial.to || initial.msg);
  const [cardFrom, setCardFrom] = useState(initial.from);
  const [cardTo, setCardTo] = useState(initial.to);
  const [cardMsg, setCardMsg] = useState(initial.msg || (received ? DEFAULT_MESSAGE : 'Some people make the world feel a little softer. Just wanted you to know you are one of them. ♡'));
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [messageInput, setMessageInput] = useState(PRESETS[0].text);
  const [composerOpen, setComposerOpen] = useState(!received);
  const [shareId, setShareId] = useState(initial.ref);
  const [toast, setToast] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0].label);
  const sponsorIsValid = /^https?:\/\//i.test(MONETAG_LINK);

  const cardMessage = useMemo(() => trim(cardMsg || DEFAULT_MESSAGE, 180), [cardMsg]);
  const signature = cardFrom ? cardFrom : 'Someone special';
  const friendName = cardTo || 'you';

  function notify(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(''), 2600);
  }

  function newId() {
    try { return crypto.randomUUID(); } catch { return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`; }
  }

  function makeShareUrl() {
    const id = shareId || newId();
    if (!shareId) setShareId(id);
    const url = new URL(window.location.pathname, window.location.origin);
    url.searchParams.set('from', trim(cardFrom, 40) || 'Someone special');
    if (trim(cardTo, 40)) url.searchParams.set('to', trim(cardTo, 40));
    url.searchParams.set('msg', cardMessage);
    url.searchParams.set('ref', id);
    const parent = initial.ref || initial.parent;
    if (parent && parent !== id) url.searchParams.set('parent', parent);
    return url.toString();
  }

  function shareCopyText(url: string) {
    const intro = cardTo ? `A little note for ${trim(cardTo, 40)} 💌` : 'A little note for someone special 💌';
    return `${intro}\nFrom ${signature}: “${cardMessage}”\n\nOpen your card: ${url}`;
  }

  function requireSender() {
    if (!trim(cardFrom, 40) && !received) {
      notify('Create your note first so your name appears on the card.');
      openComposer();
      return false;
    }
    return true;
  }

  async function copyLink() {
    if (!requireSender()) return;
    const url = makeShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      notify('Your card link is copied ♡');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const node = document.createElement('textarea');
      node.value = url;
      node.style.position = 'fixed'; node.style.opacity = '0';
      document.body.appendChild(node); node.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch { /* clipboard fallback */ }
      node.remove();
      notify(ok ? 'Your card link is copied ♡' : 'Please copy the link from your browser.');
    }
  }

  async function shareTo(kind: 'whatsapp' | 'facebook' | 'instagram' | 'x' | 'native') {
    if (!requireSender()) return;
    const url = makeShareUrl();
    const text = shareCopyText(url);
    if (kind === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    } else if (kind === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer,width=680,height=620');
    } else if (kind === 'x') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`A little note from ${signature} 💌`)}&url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer,width=680,height=620');
    } else if (navigator.share) {
      try { await navigator.share({ title: `${signature} sent you a little note 💌`, text, url }); }
      catch { /* user closed the native share sheet */ }
    } else {
      await copyLink();
    }
  }

  function createCard() {
    const from = trim(fromInput, 40);
    if (!from) {
      notify('Add your name so they know who sent the note.');
      document.getElementById('from-field')?.focus();
      return;
    }
    setCardFrom(from);
    setCardTo(trim(toInput, 40));
    setCardMsg(trim(messageInput, 180) || DEFAULT_MESSAGE);
    setShareId('');
    setComposerOpen(false);
    setSelectedPreset(PRESETS.find((p) => p.text === messageInput)?.label || 'Write my own');
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    notify('Your message card is ready ✨');
  }

  function openComposer() {
    setComposerOpen(true);
    window.setTimeout(() => document.getElementById('create-note')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), 80);
  }

  return (
    <main className="site-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <header className="topbar page-width">
        <a className="wordmark" href="/" aria-label="Miss You home"><span className="brand-heart"><Heart size={20} fill="currentColor" /></span><span>miss<span className="wordmark-light">you</span></span></a>
        <div className="nav-status"><span className="live-dot" /> A note made personal</div>
        <button className="nav-cta" onClick={openComposer}>Create a note <ArrowRight size={15} /></button>
      </header>

      <section className="hero page-width" aria-label="Your message card">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={13} /> A little something, just for you</div>
          <h1>A small note.<br /><em>A big feeling.</em></h1>
          <p className="hero-sub">Some people stay close, even when they are far away.</p>
          <div className="hero-meta"><span><Heart size={14} /> Personal, not generic</span><i /> <span><Mail size={14} /> Made in a moment</span></div>
          <div className="hero-actions">
            <button className="button-primary" onClick={() => cardFrom ? shareTo('native') : openComposer()}><Send size={16} /> Send this note <ArrowRight size={16} /></button>
            <button className="button-quiet" onClick={openComposer}>Make one for someone <ArrowDownRight size={15} /></button>
          </div>
        </div>

        <div className="card-column">
          <div className="card-overline"><span className="card-overline-dot" /> YOUR LITTLE MOMENT <span className="card-overline-line" /></div>
          <article className="letter-card" aria-label="Personal message card">
            <div className="paper-grain" aria-hidden="true" />
            <span className="corner-spark spark-a">✦</span><span className="corner-spark spark-b">✧</span>
            <div className="letter-card-top">
              <div className="sender-avatar">{(signature.trim()[0] || '♡').toUpperCase()}</div>
              <div className="sender-detail"><span>THIS NOTE IS FROM</span><strong>{signature}</strong></div>
              <div className="seal"><Heart size={19} fill="currentColor" /></div>
            </div>
            <div className="letter-recipient">A LITTLE NOTE FOR <strong>{friendName}</strong></div>
            <div className="letter-rule"><span>♡</span></div>
            <h2 className="script-title">Miss You<span className="title-heart">♡</span></h2>
            <p className="card-message">{cardMessage}</p>
            <div className="letter-signoff"><span>sent with a little love</span><strong>— {signature}</strong></div>
            <div className="card-bottom-flourish" aria-hidden="true"><span />♡<span /></div>
          </article>
          <div className="card-footnote"><span className="footnote-heart">♥</span> A thoughtful note can make an ordinary day feel special.</div>
        </div>
      </section>

      <section className="share-section page-width" aria-label="Share your note">
        <div className="section-heading"><div><span className="section-kicker">PASS THE FEELING ON</span><h2>Send a little <em>love.</em></h2></div><p>One tap to send. Your friend can make a note of their own, too.</p></div>
        <div className="share-grid">
          <button className="social-tile whatsapp" onClick={() => shareTo('whatsapp')}><MessageCircle size={19} /><span>WhatsApp</span><ArrowRight className="tile-arrow" size={14} /></button>
          <button className="social-tile facebook" onClick={() => shareTo('facebook')}><Facebook size={19} fill="currentColor" /><span>Facebook</span><ArrowRight className="tile-arrow" size={14} /></button>
          <button className="social-tile instagram" onClick={() => shareTo('instagram')}><Instagram size={19} /><span>Instagram / More</span><ArrowRight className="tile-arrow" size={14} /></button>
          <button className="social-tile x-tile" onClick={() => shareTo('x')}><X size={19} /><span>X / Twitter</span><ArrowRight className="tile-arrow" size={14} /></button>
          <button className="social-tile copy-tile" onClick={copyLink}>{copied ? <Check size={19} /> : <Copy size={19} />}<span>{copied ? 'Link copied' : 'Copy private link'}</span><ArrowRight className="tile-arrow" size={14} /></button>
        </div>
        <div className="share-note"><span className="note-pulse"><Heart size={13} fill="currentColor" /></span><span>The card carries the sender’s name and note when it opens. Share previews are personalized too.</span></div>
      </section>

      <section className={`composer-wrap page-width ${composerOpen ? 'composer-open' : ''}`} id="create-note">
        <div className="composer-topline"><span className="section-kicker">MAKE IT YOURS</span>{composerOpen && <button className="close-composer" onClick={() => setComposerOpen(false)} aria-label="Close composer"><X size={16} /></button>}</div>
        <div className="composer-layout">
          <div className="composer-intro"><h2>Make someone<br /><em>feel remembered.</em></h2><p>A name, a few honest words, and a tiny card they can keep passing on.</p><div className="composer-step"><span>01</span> Add the names</div><div className="composer-step"><span>02</span> Choose your feeling</div><div className="composer-step"><span>03</span> Send it on</div></div>
          <div className="composer-panel">
            {!composerOpen ? (
              <button className="open-composer" onClick={() => setComposerOpen(true)}><WandSparkles size={18} /> Create your own message <ArrowRight size={17} /></button>
            ) : (
              <>
                <div className="form-fields">
                  <input id="from-field" className="form-input" maxLength={40} placeholder="YOUR NAME" aria-label="Your name" autoComplete="off" value={fromInput} onChange={(e) => setFromInput(e.target.value)} />
                  <input className="form-input" maxLength={40} placeholder="FRIEND’S NAME (OPTIONAL)" aria-label="Friend's name" autoComplete="off" value={toInput} onChange={(e) => setToInput(e.target.value)} />
                </div>
                <textarea className="form-input form-message" maxLength={180} placeholder="WRITE A LITTLE SOMETHING…" aria-label="Your message" value={messageInput} onChange={(e) => { setMessageInput(e.target.value); setSelectedPreset('Write my own'); }} />
                <div className="preset-label">PICK A STARTING FEELING</div>
                <div className="preset-list">{PRESETS.map((preset) => <button key={preset.label} className={`preset-chip ${selectedPreset === preset.label ? 'preset-active' : ''}`} onClick={() => { setMessageInput(preset.text); setSelectedPreset(preset.label); }} type="button">{preset.label}</button>)}</div>
                <button className="button-primary create-button" onClick={createCard}><Sparkles size={16} /> Create my message card <ArrowRight size={16} /></button>
                <p className="form-privacy"><Heart size={12} /> No account. Your message is carried in the share link.</p>
              </>
            )}
          </div>
        </div>
      </section>

      {sponsorIsValid && <section className="sponsor page-width"><div><span className="section-kicker">SUPPORTED BY</span><h2>A little support keeps the notes coming.</h2></div><a href={MONETAG_LINK} target="_blank" rel="nofollow sponsored noopener noreferrer" className="sponsor-link">Visit sponsored link <ArrowRight size={15} /></a></section>}

      <footer className="footer page-width"><a className="wordmark footer-brand" href="/" aria-label="Miss You home"><span className="brand-heart"><Heart size={17} fill="currentColor" /></span><span>miss<span className="wordmark-light">you</span></span></a><span>For the people you are glad to have.</span><span className="footer-made">made with <Heart size={11} fill="currentColor" /> in mind</span></footer>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </main>
  );
}
