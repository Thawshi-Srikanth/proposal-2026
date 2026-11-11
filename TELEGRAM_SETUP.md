# Telegram activity updates

## Connect your bot

1. Create a bot with Telegram's official @BotFather: https://t.me/BotFather.
2. Put its token in TELEGRAM_BOT_TOKEN in .env.local. Never put the token in chat, frontend code, or a VITE_ variable.
3. Open your new bot in Telegram and send /start.
4. Run npm run telegram:chats. Copy your own chat ID into TELEGRAM_CHAT_ID in .env.local.
5. Restart the website server.

## Deploy everything together on Vercel

1. Push this complete project to a Git repository, including api/, server/, public/, src/ and vercel.json. Do not upload only dist/ and do not commit .env.local.
2. Import the repository into one Vercel project. Vite is the configured framework; build command is npm run build and output directory is dist.
3. In Vercel Project Settings → Environment Variables, add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID. Select Production (and Preview only if you want sharing enabled on previews). Never use a VITE_ prefix.
4. Deploy, or redeploy after adding the variables.
5. Open /api/telegram/status on the deployed domain. It should return enabled: true, without showing any credentials. A fresh reader session will show the sharing choice.

The book and audio use Vercel's static hosting. api/telegram/[action].js runs the consent, status and event endpoints as a Vercel Function, on the same domain. No separate server, database or npm start process is needed on Vercel.

The function uses the same signed consent cookie across cold starts and supports Vercel's parsed JSON request bodies. Rate-limit and successful-event duplicate caches are local to each warm function instance, so they are not globally coordinated across instances. Delivery still depends on Telegram/network availability; it is not a guaranteed-delivery queue.

Local development remains npm run dev. For non-Vercel Node hosting, npm run build followed by npm start serves the book and relay together. Static-only file hosting and npm run preview alone do not provide Telegram delivery.

## What the reader sees

A fresh reader sees the sharing choice as the third book page (cover, first reading page, sharing choice), before the playful response pages. There is no automatic popup on arrival, and page turns do not imply consent. It explicitly explains that page turns, button choices, timestamps and the final answer will be sent to the person who shared the book via Telegram. Read privately is equally accessible and keeps the complete book available. A small Stop sharing text control appears only while sharing is active and allows withdrawal. Already delivered Telegram updates cannot be recalled by stopping sharing.

Before opt-in, no click, page or answer events are collected or sent. Opting out clears the local pending queue and the consent cookie. Only consented events are accepted by the backend.

## Message details

Each event includes its type, date and Sri Lanka time, anonymous session reference, chapter, section, internal page position and, where relevant, button text, swipe direction, answer route and elapsed time. Time on a page is time since it was displayed, not proof it was read. A session reference does not verify who is using the link. No locations, IP addresses or device fingerprints are included in Telegram messages.

The browser queues events in session storage only after consent. Delivery is sequential, successful event retries are deduplicated, failures retry every eight seconds and on reconnection, and the reader sees pending updates. Delivery requires an open session and network access; clearing/closing the browser session can lose pending updates. Telegram or network timeouts can cause duplicate delivery if Telegram accepted a message before the acknowledgement was lost. This is not guaranteed delivery or proof of attention.

The bot token and chat ID remain server-side. The API uses a signed, HttpOnly, SameSite consent cookie, same-origin checks, payload limits, event validation and a per-session rate limit. The in-memory duplicate cache resets if the server restarts.

## Validation

npm run test:telegram runs eight tests with a mocked Telegram transport, without sending real messages. Production build passed. Real delivery remains unverified until your bot credentials are configured.



