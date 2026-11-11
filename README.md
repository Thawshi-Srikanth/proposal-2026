# The Secret You Already Know

A full-height React + Vite proposal storybook for Gundachi, addressed as Seetha Mahalakshmi.

## Edit the story

src/story.json is the single source for the cover, chapter text, permission letter, original response branches, button labels and ending text. It contains 75 readable page objects with stable IDs, illustrations, next links and button destinations. The renderer adds no story dialogue or decorative narrative captions.

See STORY_EDITING.md for examples and instructions. The original supplied story is kept in docs/original-story.md for reference only. Artwork remains in src/Illustration.jsx.

## Run and check

npm install
npm run dev

npm run test:story validates editable page links and reachability.
npm run test:original-story audits the unchanged supplied text and original special responses.
npm run test:telegram checks the Telegram relay with a mocked transport.
npm test runs all 14 checks.
npm run build builds dist.

The original aeroplane choice leads to the supplied Boeing response. Only the three escape/aeroplane/sunset response passages from the supplied story are included. Chapter four and five choices continue without invented response pages. All three endings are preserved, including the revised Aiyayo, Again NO-va? ending.

## Reading and audio

Swipe, use arrow keys, or tap the page corners. Choice pages require their buttons; swipes nudge them. The book maintains a fixed height without document scrolling. Long authored reading pages can split into smaller leaves on phones without changing or adding words.

The cover and first reading page lead into the supplied two-leaf permission letter. Sharing is optional; page turns never imply consent. The Stop sharing control appears only while sharing is active.

Background music uses public/audio/pesamale.mp3. It attempts autoplay at low volume, retries on swipes/clicks/keypresses, loops across page turns and respects intentional pauses.

## Deploy with Telegram

The complete project deploys as one Vercel project using vercel.json and api/telegram/[action].js. Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in Vercel environment settings, then deploy. Never expose tokens in frontend code or VITE_ variables. See TELEGRAM_SETUP.md.

For other Node hosting, npm run build followed by npm start serves the site and relay. npm run preview alone does not provide Telegram delivery.

## Validation

All 14 story/route/backend checks passed. The production build passed. Browser verification covered the permission/private-reading flow and the original aeroplane branch in the refactored engine; chapter two passages fit a 360 × 640 phone without clipping.
