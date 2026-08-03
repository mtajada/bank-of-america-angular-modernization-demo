import { readFile } from 'node:fs/promises';

const configUrl = new URL('../.devin/wiki.json', import.meta.url);
const config = JSON.parse(await readFile(configUrl, 'utf8'));

const fail = (message) => {
  throw new Error(`Invalid .devin/wiki.json: ${message}`);
};

const assertAllowedKeys = (value, allowed, location) => {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      fail(`${location} contains unsupported key "${key}"`);
    }
  }
};

const assertNonEmptyString = (value, location) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${location} must be a non-empty string`);
  }
};

const validateNote = (note, location) => {
  if (!note || typeof note !== 'object' || Array.isArray(note)) {
    fail(`${location} must be an object`);
  }
  assertAllowedKeys(note, new Set(['content', 'author']), location);
  assertNonEmptyString(note.content, `${location}.content`);
  if (note.content.length > 10_000) {
    fail(`${location}.content exceeds 10,000 characters`);
  }
  if (note.author !== undefined) {
    assertNonEmptyString(note.author, `${location}.author`);
  }
};

if (!config || typeof config !== 'object' || Array.isArray(config)) {
  fail('root must be an object');
}

assertAllowedKeys(config, new Set(['repo_notes', 'pages']), 'root');

const repoNotes = config.repo_notes ?? [];
if (!Array.isArray(repoNotes)) {
  fail('repo_notes must be an array');
}
repoNotes.forEach((note, index) => validateNote(note, `repo_notes[${index}]`));

const pages = config.pages ?? [];
if (!Array.isArray(pages)) {
  fail('pages must be an array');
}
if (pages.length > 30) {
  fail('pages exceeds the standard 30-page limit');
}

const titles = new Set();
let noteCount = repoNotes.length;

for (const [index, page] of pages.entries()) {
  const location = `pages[${index}]`;
  if (!page || typeof page !== 'object' || Array.isArray(page)) {
    fail(`${location} must be an object`);
  }
  assertAllowedKeys(
    page,
    new Set(['title', 'purpose', 'parent', 'page_notes']),
    location,
  );
  assertNonEmptyString(page.title, `${location}.title`);
  assertNonEmptyString(page.purpose, `${location}.purpose`);
  if (titles.has(page.title)) {
    fail(`page title "${page.title}" is not unique`);
  }
  titles.add(page.title);
  if (page.parent !== undefined && page.parent !== null) {
    assertNonEmptyString(page.parent, `${location}.parent`);
  }
  const pageNotes = page.page_notes ?? [];
  if (!Array.isArray(pageNotes)) {
    fail(`${location}.page_notes must be an array`);
  }
  pageNotes.forEach((note, noteIndex) =>
    validateNote(note, `${location}.page_notes[${noteIndex}]`),
  );
  noteCount += pageNotes.length;
}

if (noteCount > 100) {
  fail('total notes exceeds 100');
}

for (const [index, page] of pages.entries()) {
  if (page.parent !== undefined && page.parent !== null && !titles.has(page.parent)) {
    fail(`pages[${index}].parent references unknown page "${page.parent}"`);
  }
  if (page.parent === page.title) {
    fail(`pages[${index}] cannot be its own parent`);
  }
}

console.log(
  `DeepWiki configuration valid: ${pages.length} pages, ${noteCount} notes.`,
);
