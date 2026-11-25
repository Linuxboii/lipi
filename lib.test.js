import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stats, T } from './lib.js';

test('stats counts words, sentences, paragraphs across scripts', () => {
  const s = stats('Hello world. How are you?\n\nनमस्ते दुनिया');
  assert.equal(s.words, 7);
  assert.equal(s.sentences, 3);
  assert.equal(s.paragraphs, 2);
  assert.equal(s.lines, 3);
});

test('stats of empty text is all zero', () => {
  const s = stats('   ');
  assert.equal(s.words, 0);
  assert.equal(s.sentences, 0);
  assert.equal(s.paragraphs, 0);
});

test('title case keeps small words lower except first', () => {
  assert.equal(T.title('the lord of the rings'), 'The Lord of the Rings');
});

test('sentence case', () => {
  assert.equal(T.sentence('HELLO THERE. how ARE you? fine'), 'Hello there. How are you? Fine');
});

test('dedupe keeps first occurrence and order', () => {
  assert.equal(T.dedupe('b\na\nb\nc\na'), 'b\na\nc');
  assert.equal(T.dedupeCI('Apple\napple\nBanana'), 'Apple\nBanana');
});

test('natural sort orders numbers by value', () => {
  assert.equal(T.sortAZ('item 10\nitem 2\nItem 1'), 'Item 1\nitem 2\nitem 10');
});

test('unwrap joins hard-wrapped lines but keeps paragraphs', () => {
  assert.equal(T.unwrap('one\ntwo\n\nthree\nfour'), 'one two\n\nthree four');
});

test('squeeze collapses runs of spaces and trims lines', () => {
  assert.equal(T.squeeze('  a   b \t c  \n d  '), 'a b c\nd');
});

test('removeEmpty drops blank lines', () => {
  assert.equal(T.removeEmpty('a\n\n \nb'), 'a\nb');
});

test('straightQuotes and slug', () => {
  assert.equal(T.straightQuotes('“Hi” it’s'), '"Hi" it\'s');
  assert.equal(T.slug('Hello, World! Café 2026'), 'hello-world-cafe-2026');
});

test('stripHtml removes tags and decodes common entities', () => {
  assert.equal(T.stripHtml('<p>Fish &amp; chips</p>ok'), 'Fish & chips\nok');
  assert.equal(T.stripHtml('a<br/>b &lt;c&gt;'), 'a\nb <c>');
});

test('number lines', () => {
  assert.equal(T.number('a\nb'), '1. a\n2. b');
});
