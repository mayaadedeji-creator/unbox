// Saves gifts online in Supabase so links open on any device.
// Database setup: supabase/setup.sql (run once in the Supabase SQL Editor).
//
// - Gifts go in the `gifts` table. Anyone can add one, but nobody can list them;
//   a gift can only be read by its exact id, through the get_gift function.
// - Photos, drawings and voice memos are uploaded to the `gift-media` storage bucket,
//   and the gift stores their web addresses instead of the files themselves.

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && key ? createClient(url, key) : null;

const BUCKET = 'gift-media';

const EXTENSIONS = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'audio/webm': 'webm',
  'audio/ogg': 'ogg',
  'audio/mp4': 'm4a',
};

// Uploads a data: URL (e.g. "data:image/png;base64,...") and returns its public web address.
async function uploadDataUrl(giftId, dataUrl, index) {
  const blob = await (await fetch(dataUrl)).blob();
  const type = blob.type.split(';')[0];
  const path = `${giftId}/${index}.${EXTENSIONS[type] ?? 'bin'}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: type });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

// Walks an item's data and swaps every embedded file (data: URL) for an uploaded one.
async function uploadFiles(giftId, value, counter) {
  if (typeof value === 'string' && value.startsWith('data:')) {
    return uploadDataUrl(giftId, value, counter.next++);
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => uploadFiles(giftId, v, counter)));
  }
  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value).map(async ([k, v]) => [k, await uploadFiles(giftId, v, counter)])
    );
    return Object.fromEntries(entries);
  }
  return value;
}

export async function saveOnlineGift(id, gift) {
  const items = await uploadFiles(id, gift.items, { next: 0 });
  const { error } = await supabase.from('gifts').insert({
    id,
    to_name: gift.to,
    from_name: gift.from,
    items,
  });
  if (error) throw error;
}

export async function loadOnlineGift(id) {
  const { data, error } = await supabase.rpc('get_gift', { gift_id: id }).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { to: data.to_name, from: data.from_name, items: data.items, createdAt: data.created_at };
}
