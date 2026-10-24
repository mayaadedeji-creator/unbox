// Keeps the Supabase project awake. Free Supabase projects pause after a week with no
// database activity, which would break every shared gift link.
// Vercel runs this on the schedule in vercel.json (the "crons" list).
//
// It looks up a gift id that never exists, so it reads from the database without
// touching any real gifts.

import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return Response.json({ ok: false, error: 'Supabase is not configured' }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const { error } = await supabase.rpc('get_gift', { gift_id: 'keep-alive' });
  if (error) {
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }
  return Response.json({ ok: true, checkedAt: new Date().toISOString() });
}
