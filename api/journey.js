// Journey ratings for the home page.
//   GET  /api/journey                 -> { up, down }
//   POST /api/journey {"vote":"up"}   -> adds one, returns the new { up, down }
// Counts live in Upstash Redis, connected to this project from Vercel's
// Storage tab (which sets the KV_REST_API_* or UPSTASH_REDIS_REST_* env vars).
const crypto = require('crypto');

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEYS = { up: 'journey:up', down: 'journey:down' };
const VOTES_PER_IP_PER_HOUR = 5; // the browser only asks once; this just stops scripted spam

// Runs several Redis commands in one request (Upstash REST pipeline).
async function redis(commands) {
  const res = await fetch(REDIS_URL + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error('Redis responded ' + res.status);
  return (await res.json()).map((r) => {
    if (r.error) throw new Error(r.error);
    return r.result;
  });
}

function toTotals([up, down]) {
  return { up: Number(up) || 0, down: Number(down) || 0 };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(503).json({ error: 'Vote storage is not configured' });
  }

  try {
    if (req.method === 'GET') {
      const [totals] = await redis([['MGET', KEYS.up, KEYS.down]]);
      return res.status(200).json(toTotals(totals));
    }
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      return res.status(405).json({ error: 'Method not allowed' });
    }

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = null; }
    }
    const vote = body && body.vote;
    if (!Object.prototype.hasOwnProperty.call(KEYS, vote)) {
      return res.status(400).json({ error: 'vote must be "up" or "down"' });
    }

    // Per-IP limit. The IP is hashed (salted with the token) so raw
    // addresses are never stored; the key expires after an hour.
    const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
    const ipKey = 'journey:ip:' + crypto.createHash('sha256').update(REDIS_TOKEN + ip).digest('hex').slice(0, 32);
    const [, count] = await redis([['SET', ipKey, 0, 'EX', 3600, 'NX'], ['INCR', ipKey]]);
    if (count > VOTES_PER_IP_PER_HOUR) {
      return res.status(429).json({ error: 'Too many votes, try again later' });
    }

    const [, totals] = await redis([['INCR', KEYS[vote]], ['MGET', KEYS.up, KEYS.down]]);
    return res.status(200).json(toTotals(totals));
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Vote storage is unavailable' });
  }
};
