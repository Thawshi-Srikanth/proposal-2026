# Editing the book

All story text and destinations now live in src/story.json. The app reads this file directly; no chapter dialogue, alternate responses, closing speeches or decorative captions are invented in the renderer.

Find a page by its id or search for a word in its paragraphs. The pages array follows the main reading order. The three original alternate-response pages sit at the end with descriptive IDs.

## Example

{
  "id": "page-012",
  "type": "reading",
  "chapter": 2,
  "chapterTitle": "An Unfair Competition",
  "title": "",
  "art": "airplane",
  "paragraphs": ["Your first paragraph.", "**Your emphasized line.**"],
  "next": "page-013"
}

Change paragraphs to edit words. Use **bold**, *italic* or a newline inside a string. title is optional. art selects an illustration. next is the next page ID when swiping or tapping the page corner. IDs are links, so update every reference if you rename one.

## Buttons and branches

{
  "type": "choice",
  "buttons": [
    {"label": "First choice", "action": "goto", "target": "page-013"},
    {"label": "Other choice", "action": "goto", "target": "chapter-02-aeroplanes"}
  ]
}

Buttons always name their destination. Choice and response pages block swipe navigation until a button is chosen. play-music resumes the background track and then follows target. restart returns to the cover. share/private are reserved for the permission choice and never inferred from page turns.

To add a page, copy a nearby reading object, assign a unique id, change its text, and link the previous page's next field to it. Set the new page's next to the old destination. Keep JSON commas/quotes valid.

## Page types

cover: title, inscription, opening button and signature in cover.
reading: chapter story paragraphs.
choice: original chapter buttons with explicit destinations.
response: an original special response, followed by a continue button.
ending: yes, time or no ending paragraphs; the final page has a restart button.
sharing-intro / sharing-choice: the permission letter and explicit reader choice.

On small screens, the app may split a long reading object into smaller physical leaves. It never changes or adds words. Put fewer paragraphs in an object if you want closer control of the page break. Buttons appear only after that object's last leaf.

## Available illustrations

envelope, flower, lotus, ink, heart, airplane, window, cloud, paperplane, sunset, bench, waves, sun, hands, stars, guitar, notes, record, moon, coffee, home, kettle, kite, birds.

## Check your edits

npm run test:story checks page IDs, button destinations and reachability. You can change wording freely without updating these checks. The original source is retained in docs/original-story.md as a reference; it is not used to render the book. Optional: npm run test:original-story compares text and branches against the supplied source. That comparison is expected to fail after intentional rewrites.

npm run build builds the edited book.

