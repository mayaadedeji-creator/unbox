# ✏️ Project Name

Unbox 
* Still Pending
* Name doesn't appear anywhere on the application

https://mini-webapp-ruby.vercel.app/

## Intended audience

For people who want to send something more personal than a text, friends and family who live far apart, or anyone marking who enjoys thoughtful gift giving.

## Problem or opportunity

Digital messages can feel void of emotion or lack a feeling of effort that people look for in gifts. Physical care packages are slower to procure and expensive to send. 

## How it works

**Making a gift** (four steps, shown at the top of each page)

1. **Address:** write who the box is to and from. The names appear on the shipping label, both in
   the side panel and on the box itself, as you type.
2. **Fill:** pick items from the shelf. Each one opens its own editor in a pop-up; items in the box
   get a ✓.
3. **Preview:** see the box exactly as the recipient will. Opening things here doesn't count.
4. **Share:** the gift is saved and you get a link to copy and send.

**Opening a gift**

The recipient opens the link, taps the closed box to open it, and opens each item one by one (a
pink dot marks the ones they haven't opened yet). Their browser remembers what they've opened, so
coming back later shows the open box with everything still there. When they're done, they can make
a gift of their own.

## What can go in the box

| Item | What the maker does | What the recipient gets |
|---|---|---|
| Letter | Types on lined notepaper (up to 1,500 characters) | The letter on paper |
| Song | Pastes a Spotify link | A playable Spotify player |
| Photo | Uploads a JPG or PNG | The photo |
| Map Pin | Searches for a place | A map with a pin, plus "Open in Google Maps" |
| Affirmation | Shuffles affirmations from the API until one fits | The chosen affirmation card |
| Scratch Off Card | Types or draws a hidden message | A silver card to scratch off |
| Voice Memo | Records up to 60 seconds | A playable recording |
| Drawing | Draws with 3 colors and 2 brush sizes | The drawing |
| Why I'm Sending This | Finishes the sentence "I'm sending this for when…" | The finished sentence |
| Recommendation | Writes a recommendation, with an optional link | The recommendation and link |

## Technical stack

- **React 19** and **Vite 8**, with **React Router** for the pages
- **Supabase** for saving gifts online (a database table, plus file storage for photos, drawings and
  voice memos)
- **Vercel** for hosting, plus a Vercel cron job (`api/keep-alive.js`) that reads from the database
  twice a week so the free Supabase project never pauses for inactivity
- Plain CSS

## External APIs

- **[API League: Random Affirmation API](https://apileague.com/apis/random-affirmation-api/)**
  supplies the affirmations. The maker browses affirmations pulled live from the API, picks one,
  and that affirmation becomes part of the gift the recipient unwraps. Free plan: 50 calls a day,
  non-commercial use, and a credit link back to API League (shown under each affirmation). If the
  API can't be reached, the app falls back to a small built-in list so the gift can still be
  finished.
- **[OpenStreetMap Nominatim](https://nominatim.org/)** powers the Map Pin place search, and
  OpenStreetMap draws the map.
- **Spotify embeds** play the shared song.

## Running it locally

You'll need [Node.js](https://nodejs.org/) installed.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

Optional settings go in `.env.local` (copy `.env.example`):

- **Affirmations:** a free key from [API League](https://apileague.com). Without it, the app uses a
  small built-in list of affirmations.
- **Sharing across devices:** a [Supabase](https://supabase.com) project URL and publishable key.
  Run `supabase/setup.sql` once in the project's SQL Editor first. Without these, gifts are saved
  in your browser only, so links open just on that computer.

## Known limitations

- **Refreshing while making a gift loses the draft.** Saved gifts aren't affected.
- **Gifts can't be edited or deleted after they're shared.**
- **Opened items are remembered per device,** so opening the same gift on a second device starts
  with the box closed again.
- **Affirmations are limited to 50 a day** on the API's free plan. After that, they come from the
  built-in list until the next day.

## What I would improve next

- Tracking mechanism to let makers see when their gift has been opened
- Search for songs by name instead of pasting a link
- A layout designed specifically for phones
- More branding/design integration
- Making the experience more customizable, with businesses in mind.  
