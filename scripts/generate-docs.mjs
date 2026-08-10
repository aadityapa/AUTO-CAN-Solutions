// Regenerates the "Full source code" appendix of PROJECT-DOCUMENTATION.md.
//
// The prose sections (1-6) are hand-written and stay hand-written — they carry
// judgement a script can't reproduce. Everything below the APPENDIX marker is
// mechanical: a verbatim dump of the source, which is exactly the part that
// went stale when files were added and renamed.
//
//   npm run docs
//
// Run it whenever the source changes materially, and commit the result.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOC = resolve(root, 'PROJECT-DOCUMENTATION.md')

const START = '<!-- BEGIN GENERATED APPENDIX -->'
const END = '<!-- END GENERATED APPENDIX -->'

// Ordered so the appendix reads top-down: config, entry points, then features.
// A string is a single file; { dir, ext } takes every matching file in a
// directory, sorted. Deliberately hand-rolled rather than using fs.globSync,
// which needs Node 22 — CI and Vercel run Node 20.
const SOURCES = [
  'package.json',
  'vite.config.js',
  'vercel.json',
  'eslint.config.js',
  'index.html',
  'src/main.jsx',
  'src/routes.jsx',
  'src/Layout.jsx',
  { dir: 'src/seo', ext: ['.js', '.jsx'] },
  { dir: 'src/data', ext: ['.js'] },
  { dir: 'src/pages', ext: ['.jsx'] },
  { dir: 'src/components', ext: ['.js', '.jsx', '.css'] },
  { dir: 'src/styles', ext: ['.css'] },
  { dir: 'scripts', ext: ['.mjs'] },
  'public/robots.txt',
  'public/llms.txt',
  'public/site.webmanifest',
]

const FENCE = {
  '.json': 'json',
  '.js': 'js',
  '.mjs': 'js',
  '.jsx': 'jsx',
  '.css': 'css',
  '.html': 'html',
  '.webmanifest': 'json',
  '.txt': 'text',
  '.xml': 'xml',
}

function expand(entry) {
  if (typeof entry === 'string') {
    return existsSync(resolve(root, entry)) ? [entry] : []
  }
  const dir = resolve(root, entry.dir)
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isFile() && entry.ext.includes(extname(item.name)))
    .map((item) => `${entry.dir}/${item.name}`)
    .sort()
}

function collectFiles() {
  const seen = new Set()
  return SOURCES.flatMap(expand).filter((file) => !seen.has(file) && seen.add(file))
}

function renderAppendix(files) {
  const generated = new Date().toISOString().slice(0, 10)
  const body = files.map((file) => {
    const source = readFileSync(resolve(root, file), 'utf8').replace(/\s+$/, '')
    const lang = FENCE[extname(file)] ?? ''
    // A file containing ``` would break a 3-backtick fence.
    const fence = source.includes('```') ? '````' : '```'
    return `## \`${file}\`\n\n${fence}${lang}\n${source}\n${fence}\n`
  })

  return [
    START,
    '',
    `# 7. Full source code`,
    '',
    `_Generated from the working tree by \`npm run docs\` on ${generated}. Do not edit by hand —_`,
    `_edits here are overwritten. ${files.length} files._`,
    '',
    ...body,
    END,
  ].join('\n')
}

const files = collectFiles()
const current = readFileSync(DOC, 'utf8')
const appendix = renderAppendix(files)

let next
if (current.includes(START) && current.includes(END)) {
  // This script is itself part of the appendix, so its source contains both
  // marker strings. The real markers are the outermost pair: the first START
  // and the last END. Using indexOf for both would splice at the copy embedded
  // in this file and shred the document.
  next =
    current.slice(0, current.indexOf(START)) +
    appendix +
    current.slice(current.lastIndexOf(END) + END.length)
} else {
  // First run: replace everything from the old hand-pasted appendix onward.
  const legacy = current.search(/^#+ 7\. Full source code\s*$/m)
  const prose = legacy === -1 ? current.replace(/\s+$/, '') + '\n\n---\n\n' : current.slice(0, legacy)
  next = prose + appendix + '\n'
}

writeFileSync(DOC, next)
console.log(`[docs] appendix regenerated from ${files.length} files → PROJECT-DOCUMENTATION.md`)
