import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Personalized Miss You message card';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const clean = (value: string | null, max: number) => (value || '').replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const from = clean(query.get('from'), 40) || 'Someone special';
  const to = clean(query.get('to'), 40) || 'someone they care about';
  const message = clean(query.get('msg'), 180) || 'No matter how far apart we are, you are always in my thoughts. ♡';
  const lines = message.length > 116 ? `${message.slice(0, 113).trimEnd()}…` : message;

  return new ImageResponse(
    (
      <div style={{
        width: '1200px', height: '630px', display: 'flex', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(125deg, #090d22 0%, #211432 48%, #743253 100%)', color: '#fff8ff',
        fontFamily: 'Georgia, serif',
      }}>
        <div style={{ position: 'absolute', top: '-190px', right: '-30px', width: '610px', height: '610px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,126,183,.38) 0%, rgba(182,160,255,.12) 45%, transparent 70%)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: '-300px', left: '-130px', width: '650px', height: '650px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(92,115,220,.3) 0%, transparent 68%)', display: 'flex' }} />
        <div style={{ position: 'absolute', left: '58px', top: '44px', display: 'flex', alignItems: 'center', gap: '13px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '15px', border: '1px solid rgba(255,151,203,.7)', background: 'rgba(255,139,195,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff9acb', fontSize: '29px' }}>♡</div>
          <div style={{ display: 'flex', fontSize: '28px', letterSpacing: '-1px' }}>miss<span style={{ color: '#c5b2ff' }}>you</span></div>
        </div>
        <div style={{ position: 'absolute', top: '57px', right: '62px', display: 'flex', padding: '11px 18px', borderRadius: '30px', border: '1px solid rgba(255,255,255,.25)', color: '#f8c9e2', fontSize: '14px', letterSpacing: '2px' }}>A LITTLE NOTE, A LOT OF HEART</div>
        <div style={{ position: 'absolute', top: '140px', left: '64px', display: 'flex', flexDirection: 'column', width: '500px' }}>
          <div style={{ display: 'flex', color: '#f8a6cf', fontSize: '16px', letterSpacing: '4px', marginBottom: '18px' }}>A PERSONAL MESSAGE FOR</div>
          <div style={{ display: 'flex', color: '#fff7fc', fontSize: '57px', fontWeight: 500, lineHeight: 1.06, maxWidth: '490px', overflowWrap: 'anywhere' }}>{to}</div>
          <div style={{ display: 'flex', color: '#ff9acb', fontSize: '78px', fontStyle: 'italic', lineHeight: 1.14, marginTop: '16px' }}>Miss You ♡</div>
          <div style={{ display: 'flex', color: '#e4d9ee', fontSize: '23px', lineHeight: 1.5, marginTop: '18px', maxWidth: '480px' }}>{lines}</div>
        </div>
        <div style={{ position: 'absolute', right: '62px', top: '153px', width: '445px', height: '360px', display: 'flex', flexDirection: 'column', padding: '32px', color: '#4e2c53', borderRadius: '7px 25px 7px 25px', border: '2px solid rgba(255,255,255,.8)', background: 'linear-gradient(135deg, #fff9fc 0%, #fdeaf3 50%, #f0e5ff 100%)', boxShadow: '0 28px 80px rgba(0,0,0,.34)' }}>
          <div style={{ position: 'absolute', inset: '10px', border: '1px solid rgba(183,105,157,.28)', borderRadius: '3px 19px 3px 19px', display: 'flex' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '13px', borderBottom: '1px solid rgba(180,107,155,.35)', paddingBottom: '18px' }}>
            <div style={{ width: '44px', height: '44px', flexShrink: 0, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8d8ec', border: '1px solid #e6a7d0', color: '#b13f83', fontSize: '25px' }}>{from.charAt(0).toUpperCase()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', color: '#a16e98', fontFamily: 'Arial, sans-serif', fontSize: '12px', letterSpacing: '3px' }}>SENT WITH LOVE BY</div>
              <div style={{ display: 'flex', color: '#532a59', fontSize: '26px', marginTop: '5px', lineHeight: 1.1 }}>{from}</div>
            </div>
            <div style={{ display: 'flex', marginLeft: 'auto', color: '#e75c9f', fontSize: '32px' }}>♥</div>
          </div>
          <div style={{ display: 'flex', color: '#bd77a8', fontFamily: 'Arial, sans-serif', fontSize: '12px', letterSpacing: '2px', marginTop: '24px' }}>A LITTLE SOMETHING FOR YOU</div>
          <div style={{ display: 'flex', color: '#a4317b', fontSize: '58px', fontStyle: 'italic', marginTop: '8px', lineHeight: 1.13 }}>Miss You</div>
          <div style={{ display: 'flex', marginTop: '12px', color: '#674567', fontSize: '19px', lineHeight: 1.55, overflowWrap: 'anywhere' }}>{lines}</div>
          <div style={{ display: 'flex', marginTop: 'auto', justifyContent: 'space-between', alignItems: 'center', color: '#b16b99', fontFamily: 'Arial, sans-serif', fontSize: '13px' }}><span>MADE JUST FOR YOU</span><span style={{ color: '#d65498', fontSize: '22px' }}>♡</span></div>
        </div>
        <div style={{ position: 'absolute', left: '64px', bottom: '45px', display: 'flex', gap: '11px', alignItems: 'center', color: '#c6bad8', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}><span style={{ color: '#ff9acb', fontSize: '22px' }}>♡</span> Pass a little love from friend to friend.</div>
        <div style={{ position: 'absolute', right: '70px', bottom: '45px', color: 'rgba(255,255,255,.6)', display: 'flex', fontFamily: 'Arial, sans-serif', fontSize: '12px', letterSpacing: '3px' }}>MISSYOU.LOVE</div>
      </div>
    ),
    { ...size },
  );
}
