// Affirmations come from API League's Random Affirmation API:
// https://apileague.com/apis/random-affirmation-api/
// Each call returns { affirmation, image }; we only use the text.
// Free plan: 50 calls/day, non-commercial, and the app must link back to apileague.com
// (see AffirmationCredit).

const API_URL = 'https://api.apileague.com/retrieve-random-affirmation';

// Only used if the API can't be reached (no key, daily limit hit, offline), so the
// maker can still finish their gift. These are marked source: 'backup'.
const BACKUP = [
  'You are more loved than you know.',
  'You are allowed to take up space.',
  'You are doing better than you think.',
  'Your kindness makes a difference.',
  'You bring light to the people around you.',
  'You are capable of amazing things.',
  'Rest is productive too.',
  'You are exactly where you need to be.',
  'Good things are coming your way.',
  'You are enough, just as you are.',
];

function backupAffirmation() {
  const text = BACKUP[Math.floor(Math.random() * BACKUP.length)];
  return { text, source: 'backup' };
}

// The free plan allows 1 request per second; space calls out so quick shuffles don't get rejected.
let lastCallAt = 0;
async function waitForRateLimit() {
  const wait = lastCallAt + 1000 - Date.now();
  if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
  lastCallAt = Date.now();
}

// Returns { text, source: 'api' | 'backup' }.
export async function fetchAffirmation(signal) {
  const key = import.meta.env.VITE_APILEAGUE_KEY;
  if (!key) {
    console.warn('VITE_APILEAGUE_KEY is not set — using backup affirmations. See .env.example.');
    return backupAffirmation();
  }

  try {
    await waitForRateLimit();
    // The key goes in the URL, not an x-api-key header: a custom header makes the browser
    // send a CORS preflight first, which API League's server rejects.
    const res = await fetch(`${API_URL}?api-key=${encodeURIComponent(key)}`, { signal });
    if (!res.ok) {
      // 401 = bad key, 402 = daily limit used up, 429 = more than 1 request/second
      console.warn(`Affirmation API responded ${res.status} — using a backup affirmation.`);
      return backupAffirmation();
    }
    const json = await res.json();
    if (!json.affirmation) return backupAffirmation();
    return { text: json.affirmation, source: 'api' };
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    console.warn('Affirmation API unreachable — using a backup affirmation.', err);
    return backupAffirmation();
  }
}
