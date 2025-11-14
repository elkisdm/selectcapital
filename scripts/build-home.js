const { readFileSync, writeFileSync, readdirSync } = require('node:fs');
const { resolve, dirname, join } = require('node:path');

const projectRoot = resolve(dirname(__filename), '..');
const templatePath = resolve(projectRoot, 'templates', 'home.template.html');
const partialsDir = resolve(projectRoot, 'partials', 'home');
const outputPath = resolve(projectRoot, 'home.html');

const template = readFileSync(templatePath, 'utf8');

const partials = Object.fromEntries(
  readdirSync(partialsDir).map((filename) => {
    const name = filename.replace(/\.html$/, '');
    const raw = readFileSync(join(partialsDir, filename), 'utf8').replace(/\s*$/, '');
    const lines = raw.split('\n');
    const indents = lines
      .filter((line) => line.trim().length > 0 && !line.trimStart().startsWith('<!--'))
      .map((line) => line.match(/^\s*/)[0].length);
    const minIndent = indents.length ? Math.min(...indents) : 0;
    const normalized = lines
      .map((line) => {
        if (!minIndent) return line;
        const prefix = line.match(/^\s*/)[0];
        if (prefix.length >= minIndent) {
          return line.slice(minIndent);
        }
        return line;
      })
      .join('\n');
    return [name, normalized];
  }),
);

let output = template;

Object.entries(partials).forEach(([name, content]) => {
  const pattern = new RegExp(`^([\t ]*)\{\{> ${name}\}\}`, 'm');
  output = output.replace(pattern, (_, indent) => {
    const lines = content.split('\n');
    return lines.map((line) => (line ? `${indent}${line}` : '')).join('\n');
  });
});

writeFileSync(outputPath, output);
console.log(`Built home.html from template using ${Object.keys(partials).length} partials.`);

