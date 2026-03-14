#!/usr/bin/env node

import { marked } from "marked"
import fs from "node:fs"
import path from "node:path"

const fname = 'README.md';

const packageDir = path.dirname(import.meta.filename);
const examplesDir = path.join(packageDir, 'examples');

const text = fs.readFileSync(fname, 'utf-8');
const lexer = new marked.Lexer({});
let i = 0;
for (const token of lexer.lex(text)) {
  if (token.type === 'code' && token.lang === 'ts') {
    fs.writeFileSync(path.join(examplesDir, `readme${i+1}.ts`), token.text, 'utf-8');
    i++;
  }
}
