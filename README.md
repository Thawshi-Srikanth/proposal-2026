# The Secret — for Seetha Mahalakshmi

A full-height React + Vite proposal storybook using the supplied seven-chapter Tanglish story. Swipe reading pages, use arrow keys, or tap the page corners. Responses have dedicated pages; swipes on those pages nudge the buttons. Three endings remain available. Answers are not saved or sent.

## Run

npm install
npm run dev

npm run build creates the production site in dist.

## Background music

Put the chosen song file at public/audio/pesamale.mp3. The song audio file is included. The visible YouTube player has been removed.

The audio element attempts autoplay at 32% volume, loops across page turns and retries directly on page-turn buttons, completed swipes, clicks, touch-end and keyboard events when browsers block autoplay. The sound button pauses/resumes it; intentional pauses are respected. Audio is not recreated when pages turn. A missing file is handled without breaking the story. For M4A, use public/audio/pesamale.m4a and update the audio src in src/main.jsx.

Playback was verified after a fresh cover-button click and after a fresh cover swipe. The MP3 duration is 206.96 seconds. Intentional pause was verified to survive page turns. Production build passed.

## Content and artwork

The user's story is in src/story.json. Flow and original thin pen-and-ink SVG illustrations are in src/main.jsx. Styles use readable Mukta Malar for story text and small Kavivanar annotations. Paragraphs gently reveal in sequence; reduced-motion preferences show them immediately.

The personal cover is titled The Secret and references the book she asked for. Added dialogue is original conversational Tanglish. The earlier Phosphor source assets and their MIT license remain in src/assets as design references; the rendered illustrations use fine SVG stroke linework.

## Browser checks from the book redesign

The full-height layout, swipe navigation, dedicated responses, original seven chapters and yes ending were checked at 360 × 640. Desktop spreads were checked at 1280 × 800. The later clearer font was checked through all seven chapters without clipped passages.


## Guitar and no-response ending update

The guitar is now drawn in one rotated coordinate system with a symmetrical acoustic body, aligned neck and sound hole, six parallel strings between nut and bridge, frets and six tuning pegs. Fine pen strokes are preserved.

Only the no-response ending was replaced with the user's Aiyayo, Again NO-va? text. The remaining chapters and other endings are unchanged. Bold and italic formatting are supported, including the Hate you. sign-off. Browser checks confirmed the guitar rendering, the no-response route and every new ending page fitting without clipped text. The final italic sign-off was verified. Production build passed.

## Optional Telegram updates

See TELEGRAM_SETUP.md. The reader must explicitly opt in before reading activity or answers are collected or sent. Bot credentials go only in .env.local or server environment variables. The complete project can be deployed as one Vercel project using vercel.json and api/telegram/[action].js. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel environment settings, then deploy. No separate server is needed. For other Node hosting, use npm start after building. Live Telegram delivery has not yet been tested because bot credentials are not configured.


## Consistent page height and third-page sharing choice

The sharing introduction is now a playful in-book page after the first reading page. It asks the reader to share activity or read privately, with explicit disclosure. Page turns do not grant consent. The initial automatic sharing modal was removed; the shield still opens settings on request.

The app uses a single minmax grid row, display:contents for out-of-flow sharing controls, and a stable small-viewport height. Cover and reading views share the same height. Pagination observes the app's actual dimensions rather than changing with browser chrome. Desktop checks showed an identical 662px book height across cover, reading and sharing pages; a 360 × 640 phone check showed a stable 623px book height across the sharing/private-reading transition, without document scrolling. Swiping on sharing stayed on the page, and private reading continued with no shared status.

## Supplied permission-letter copy

The user's new permission wording begins on the third book page and continues onto one following leaf containing the Telegram disclosure, the exact supplied yes/private button labels and P.S. The introduction can be swiped like a reading page; the decision leaf requires an explicit button choice and blocks swipe-to-consent. Both leaves were checked at 360 × 640 and 320 × 568, with no clipping or book-height change. Build passed.
