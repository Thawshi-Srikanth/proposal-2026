import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const story=JSON.parse(readFileSync(new URL('./story.json',import.meta.url),'utf8'));
const original=readFileSync(new URL('../docs/original-story.md',import.meta.url),'utf8').replace(/\r\n/g,'\n');
const sections=original.split(/^## /m).filter(Boolean),byId=new Map(story.pages.map(p=>[p.id,p]));

test('every editable page ID is unique and every route exists',()=>{assert.equal(byId.size,story.pages.length);assert.ok(byId.has(story.startPage));for(const p of story.pages){if(p.next)assert.ok(byId.has(p.next),`${p.id}: missing next`);for(const b of p.buttons||[]){assert.ok(['goto','share','private','play-music','restart'].includes(b.action));assert.ok(byId.has(b.target),`${p.id}: missing button destination`)}}});
test('every page is reachable through authored next links and choice destinations',()=>{const seen=new Set(),queue=[story.startPage];while(queue.length){const id=queue.pop();if(seen.has(id))continue;seen.add(id);const p=byId.get(id);if(p.next)queue.push(p.next);for(const b of p.buttons||[])queue.push(b.target)}assert.equal(seen.size,story.pages.length)});
