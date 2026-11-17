# unbox

A web app for making and sending a digital care package. Fill a box with small personal things
(a letter, a song, a voice memo, a drawing…), wrap it up, and send the link. The person who gets it
unwraps the box and opens each gift one by one.

**Live site:** https://unbox-pearl.vercel.app/

## Intended audience

People who want to send something more personal than a text: friends and family who live far apart,
or anyone who enjoys thoughtful gift giving.

## Problem or opportunity

Digital messages can feel empty of emotion, without the sense of effort people look for in a gift.
Physical care packages are slow to put together and expensive to send. unbox sits in between: it's
quick and free to send, but it still feels like opening a box someone packed for you.

## How it works

Everything happens in one open "room": the box sits in the middle, and whatever you're working on
comes forward over the dimmed room, with an X in the corner to close it. There's no step bar; the
box itself shows how far along you are.

**Making a gift**

1. **Address:** tap the blank tag next to the closed box and write who it's to and from. Attach it
   and it lands on the box as a shipping label (tap the label later to change it).
2. **Fill:** the box opens and the gifts wait on shelves on the wall. Tap one to bring it forward
   and make it, then **Add to box** drops it in. (There are a couple of easter eggs hidden on the
   shelves.)
3. **Preview:** the gifts sink into the box and it closes. You then see the gift exactly as the
   recipient will. Opening things here doesn't count.
4. **Share:** the gift is saved and wraps itself up in paper and ribbon in front of you. A delivery
   slip lets you write a short message, and **Deliver your gift** opens your phone's share menu
   (on a computer, it copies the link instead).

**Opening a gift**

The recipient opens the link and taps the wrapped box: the bow flies off, the paper falls away, and
the box opens. Each gift stands up inside to be tapped open, and a pink dot marks the ones they
haven't opened yet. Their browser remembers what they've opened, so coming back later shows the
open box with everything still there. When they're done, they can make a gift of their own.

The **unbox** wordmark in the corner goes to the homepage, which offers to continue a gift in
progress or start a new one.

## What can go in the box

| Item | What the maker does | What the recipient gets |
|---|---|---|
| Letter | Types on lined notepaper (up to 1,500 characters) | The letter on paper |
| Song | Searches for a song by name (or pastes a Spotify link) | A playable Spotify player |
| Photo | Uploads a JPG or PNG | The photo |
| Map Pin | Searches for a place and adds an optional note | A map with a pin, the note, and "Open in Google Maps" |
| Affirmation | Shuffles affirmations from the API until one fits | The chosen affirmation card |
| Scratch Off Card | Types or draws a hidden message | A silver card to scratch off |
| Voice Memo | Records up to 60 seconds | A playable recording |
| Drawing | Draws with crayon colors and brush sizes | The drawing |
| Why I'm Sending This | Finishes the sentence "I'm sending this for when…" | The finished sentence |
| Recommendation | Writes a recommendation, with an optional link | The recommendation and link |

## Design

- Custom SVG art for the box (closed and open), the gift icons, the address tag and the wrapping
  paper, ribbon and bow.
- Animations for the key moments: the tag landing on the box, gifts dropping in, the box closing,
  wrapping, unwrapping and gifts popping up.
- Every color and font comes from one file, [`src/styles/token.css`](src/styles/token.css), so the
  whole look can be changed in one place.
- Accessibility: header and main landmarks, a hidden heading on each step for screen readers,
  labeled buttons, and Escape (or clicking the dimmed room) closes any open gift.

## How it's different from the first version

unbox is a redesign of my earlier project, [mini_webapp](https://mini-webapp-ruby.vercel.app/).
The idea and the ten gift types are the same; this version focuses on the interface design and
gives the app its own look.

| | mini_webapp (first version) | unbox (this version) |
|---|---|---|
| **Layout** | Three fixed, colored panels: steps across the top, the box on the left (65%), and a side panel on the right (35%) | One open "room" with the box in the middle and nothing around it |
| **Progress** | A four-step bar across the top of each page | No step bar; the box itself shows where you are (closed, labeled, open, filled, wrapped) |
| **Addressing** | "To" and "From" fields in the side panel, with the label updating as you type | A blank tag next to the box that you write on and attach |
| **Picking gifts** | A grid of item cards in the side panel, with a ✓ on the ones already in the box | Gift icons sitting on shelves on the wall, which drop into the box when added |
| **Making a gift** | A centered pop-up window with a title bar | The gift comes forward over the dimmed room, with an X in the corner and "Add to box" below |
| **Sharing** | A link to copy | The box wraps itself in paper and ribbon, and a delivery slip with a short message opens the phone's share menu |
| **Opening** | The box opens on tap | The recipient unwraps the box first (bow flies off, paper falls away), then the gifts pop up inside |
| **Look** | Starter-template colors and fonts, with pastel panel backgrounds | Its own palette, handwriting font for notes and labels, and custom SVG art for the box, gifts and wrapping, all from one tokens file |
| **Animation** | Very little | The tag landing, gifts dropping in, the box closing, wrapping, unwrapping and gifts popping up |
| **Song** | Paste a Spotify link | Search for a song by name (paste a link still works) |
| **Map Pin** | Pick a place | Shorter place names and an optional note to go with the pin |
| **Extras** | None | A homepage behind the wordmark, easter eggs on the shelves, and screen reader landmarks and headings |

## Technical stack

- **React 19** and **Vite 8**, with **React Router** for the pages
- **Supabase** for saving gifts online (a database table, plus file storage for photos, drawings and
  voice memos)
- **Vercel** for hosting and two serverless functions:
  - `api/song-search.js` searches Spotify, keeping the Spotify secret off the browser
  - `api/keep-alive.js` is a cron job that reads from the database twice a week (Monday and
    Thursday), so the free Supabase project never pauses for inactivity
- Plain CSS

## External APIs

- **[API League: Random Affirmation API](https://apileague.com/apis/random-affirmation-api/)**
  supplies the affirmations. The maker browses affirmations pulled live from the API, picks one,
  and that affirmation becomes part of the gift. Free plan: 50 calls a day, non-commercial use, and
  a credit link back to API League (shown under each affirmation). If the API can't be reached, the
  app falls back to a small built-in list so the gift can still be finished.
- **[Spotify Web API](https://developer.spotify.com/documentation/web-api)** powers the song search
  (through `api/song-search.js`), and **Spotify embeds** play the shared song.
- **[OpenStreetMap Nominatim](https://nominatim.org/)** powers the Map Pin place search, and
  OpenStreetMap draws the map.

## Project structure

```
api/                 Vercel serverless functions (song search, Supabase keep-alive)
public/              Favicon and static icons
src/
  pages/             One page per step: Opening (address), FillTheBox, Preview, Share,
                     Gift (the recipient's view) and Home
  components/        The room layout, the box, the shelves, the overlay, wrapping and unboxing
  features/          One editor per gift type, plus the viewers the recipient sees
                     (catalog.js lists every gift)
  context/           PackageContext: the gift being made (to, from, items)
  storage/           Saving and loading gifts (Supabase, or this browser if Supabase isn't set up)
  styles/token.css   Colors and fonts
  assets/            SVG art for the box and gifts
supabase/setup.sql   Creates the gifts table and storage bucket
vercel.json          Page routing and the keep-alive cron schedule
```

## Running it locally

You'll need [Node.js](https://nodejs.org/) installed.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173.

Optional settings go in `.env.local` (copy `.env.example`):

- **Affirmations:** a free key from [API League](https://apileague.com) (`VITE_APILEAGUE_KEY`).
  Without it, the app uses a small built-in list of affirmations.
- **Sharing across devices:** a [Supabase](https://supabase.com) project URL and publishable key
  (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`). Run `supabase/setup.sql` once in the
  project's SQL Editor first. Without these, gifts are saved in your browser only, so links open
  just on that computer.
- **Song search:** a client ID and secret from the
  [Spotify developer dashboard](https://developer.spotify.com/dashboard) (`SPOTIFY_CLIENT_ID`,
  `SPOTIFY_CLIENT_SECRET`). `npm run dev` runs the search function locally too (see
  `vite.config.js`). Without these, songs can still be added by pasting a Spotify link.

## Deploying

The site is hosted on Vercel. Add the same variables from `.env.local` under
**Vercel → Settings → Environment Variables**, using just the value (not the `NAME=` part).
With the GitHub repo connected to Vercel, each push to `main` deploys automatically.

## Known limitations

- **Refreshing while making a gift loses the draft.** Saved gifts aren't affected.
- **Gifts can't be edited or deleted after they're shared.**
- **Opened items are remembered per device,** so opening the same gift on a second device starts
  with the box wrapped again.
- **Affirmations are limited to 50 a day** on the API's free plan. After that, they come from the
  built-in list until the next day.
- **The API League key is visible in the browser,** since the affirmation request is made from the
  page. It could move into a Vercel function like the Spotify search.
- **The homepage is mostly blank for now;** the main address goes straight to making a gift.

## What I would improve next

- Let makers see when their gift has been opened
- A layout designed specifically for phones
- Fill out the homepage
- More ways to customize the box and wrapping paper
