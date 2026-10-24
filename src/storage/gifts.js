// Saving and loading gifts.
//
// With VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY set (see .env.example), gifts
// are saved online in Supabase and links open on any device. Without them, gifts are
// saved in this browser only, which is handy for running the project locally.

import { fromCatalog } from '../features/catalog.js';
import { loadLocalGift, saveLocalGift } from './localGifts.js';

export const savesOnline = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
);

// Supabase's library is big, so only load it when a gift is actually saved or opened.
const online = () => import('./supabaseGifts.js');

// Short, hard-to-guess id for the link, like "k3Xp9QaZ2m".
function makeId(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}

// Returns the new gift's id.
export async function saveGift({ to, from, items }) {
  const id = makeId();
  const gift = {
    to,
    from,
    items: items.map(({ id: itemId, data }) => ({ id: itemId, data })),
    createdAt: new Date().toISOString(),
  };
  if (savesOnline) await (await online()).saveOnlineGift(id, gift);
  else await saveLocalGift(id, gift);
  return id;
}

// Returns { to, from, items } with each item's name and icon filled back in, or null.
export async function loadGift(id) {
  const gift = savesOnline ? await (await online()).loadOnlineGift(id) : await loadLocalGift(id);
  if (!gift) return null;
  return {
    ...gift,
    items: gift.items
      .filter((item) => fromCatalog(item.id))
      .map((item) => ({ ...fromCatalog(item.id), data: item.data })),
  };
}

export function giftUrl(id) {
  return `${window.location.origin}/gift/${id}`;
}
