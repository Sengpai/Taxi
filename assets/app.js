// =============================
// Helpers
// =============================
function isAdTraffic(qs) {
  return !!(qs.get('gclid') || qs.get('gbraid') || qs.get('wbraid') ||
            qs.get('utm_source') || qs.get('utm_medium') || qs.get('utm_campaign'));
}
function deviceFromUA(ua) {
  return /mobile|android|iphone/i.test(ua) ? 'mobile'
       : /tablet|ipad/i.test(ua) ? 'tablet'
       : 'desktop';
}
function isBot(ua) {
  return /bot|crawler|spider|AdsBot|Lighthouse|PageSpeed|Speed Insights/i.test(ua);
}

// =============================
// Log truy cập từ Google Ads
// =============================
(function logAdLandingOnce() {
  try {
    const qs = new URLSearchParams(location.search);
    if (!isAdTraffic(qs)) return;

    const ua = navigator.userAgent || '';
    if (isBot(ua)) return;

    if (sessionStorage.getItem('adLandingLogged')) return;
    sessionStorage.setItem('adLandingLogged', '1');

    const data = {
      url: location.href + '#landing',
      referrer: document.referrer || '',
      gclid: qs.get('gclid') || '',
      gbraid: qs.get('gbraid') || '',
      wbraid: qs.get('wbraid') || '',
      utm_source: qs.get('utm_source') || '',
      utm_medium: qs.get('utm_medium') || '',
      utm_campaign: qs.get('utm_campaign') || '',
      device: deviceFromUA(ua)
    };

    fetch('/.netlify/functions/clicklog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify(data)
    }).catch(() => {});
  } catch (err) {
    console.error('Log error:', err);
  }
})();

// =============================
// (Tuỳ chọn) Log thêm sự kiện stay 5s
// =============================
setTimeout(() => {
  try {
    if (!sessionStorage.getItem('adLandingLogged')) return;
    const qs = new URLSearchParams(location.search);
    navigator.sendBeacon('/.netlify/functions/clicklog', JSON.stringify({
      url: location.href + '#stay-5s',
      gclid: qs.get('gclid') || '',
      gbraid: qs.get('gbraid') || '',
      wbraid: qs.get('wbraid') || ''
    }));
  } catch {}
}, 5000);

// =============================
// Hook click nút gọi (tel:) và Zalo
// (gắn sau khi DOM sẵn sàng cho chắc)
// =============================
(function attachCtaLogging() {
  const run = () => {
    ['a[href^="tel:"]', 'a[href*="zalo.me"]'].forEach(sel => {
      document.querySelectorAll(sel).forEach(a => {
        a.addEventListener('click', () => {
          const qs = new URLSearchParams(location.search);
          navigator.sendBeacon('/.netlify/functions/clicklog', JSON.stringify({
            url: location.href + '#cta-click',
            referrer: document.referrer || '',
            gclid: qs.get('gclid') || '',
            gbraid: qs.get('gbraid') || '',
            wbraid: qs.get('wbraid') || '',
            device: deviceFromUA(navigator.userAgent || '')
          }));
        });
      });
    });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
