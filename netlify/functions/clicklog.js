// netlify/functions/clicklog.js
exports.handler = async (event) => {
  try {
    const h = event.headers || {};
    const ip =
      h['x-nf-client-connection-ip'] ||
      h['client-ip'] ||
      (h['x-forwarded-for'] ? h['x-forwarded-for'].split(',')[0].trim() : '') ||
      '';

    const body = event.httpMethod === 'POST' && event.body ? JSON.parse(event.body) : {};

    const payload = {
      ip,
      userAgent: h['user-agent'] || '',
      url: body.url || '',
      referrer: body.referrer || '',
      gclid: body.gclid || '',
      utm_source: body.utm_source || '',
      utm_medium: body.utm_medium || '',
      utm_campaign: body.utm_campaign || '',
      device: body.device || ''
    };

    const url = process.env.GAS_WEBHOOK_URL; // bạn đã set trong Netlify
    if (url) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    return { statusCode: 204, body: '' };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
