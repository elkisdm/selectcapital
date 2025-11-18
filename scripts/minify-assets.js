const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');
const { createHash } = require('node:crypto');
const csso = require('csso');
const terser = require('terser');

const projectRoot = resolve(__dirname, '..');
const distDir = resolve(projectRoot, 'dist');

const assets = [
  { path: 'lenguaje visual/theme/select-capital-theme.css', type: 'css' },
  { path: 'lenguaje visual/theme/home.css', type: 'css' },
  { path: 'lenguaje visual/theme/sc-header-footer.css', type: 'css' },
  { path: 'lenguaje visual/theme/theme-toggle.js', type: 'js' },
];

const htmlTargets = [
  'home.html',
  'index.html',
  'gracias.html',
  'templates/home.template.html',
  'simulador/index.html',
  'landing/proyecto-inmobiliario/base.html',
  'dashboard/panel-estatico.html',
  'dashboard/insights-dashboard.html',
  'pdf/proposal-template.html',
];

if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

const manifest = {};

const encodeIfNeeded = (value) => value.replace(/ /g, '%20');
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function run() {
  for (const asset of assets) {
    const sourcePath = resolve(projectRoot, asset.path);
    const raw = readFileSync(sourcePath, 'utf8');
    let minified;

    if (asset.type === 'css') {
      minified = csso.minify(raw).css;
    } else if (asset.type === 'js') {
      const result = await terser.minify(raw, {
        compress: true,
        mangle: true,
        format: { comments: false },
      });
      if (result.error) {
        throw result.error;
      }
      minified = result.code;
    } else {
      throw new Error(`Unknown asset type: ${asset.type}`);
    }

    const minPath = asset.path.replace(/(\.\w+)$/, '.min$1');
    const destination = resolve(projectRoot, minPath);
    writeFileSync(destination, minified);

    const hash = createHash('sha256').update(minified).digest('hex').slice(0, 10);
    manifest[asset.path] = {
      minPath,
      hash,
      versioned: `${minPath}?v=${hash}`,
    };
  }

  writeFileSync(resolve(distDir, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));

  htmlTargets.forEach((relativePath) => {
    const absPath = resolve(projectRoot, relativePath);
    let content = readFileSync(absPath, 'utf8');
    let updated = content;

  Object.entries(manifest).forEach(([original, info]) => {
    const targets = Array.from(new Set([original, info.minPath])).filter(Boolean);
    targets.forEach((target) => {
      const encodedTarget = encodeIfNeeded(target);
      const encodedVersioned = encodeIfNeeded(info.versioned);
      const queryPattern = new RegExp(`${escapeRegExp(target)}\\?v=[^"\\s>]+`, 'g');
      updated = updated.replace(queryPattern, info.versioned);
      if (encodedTarget !== target) {
        const encodedQueryPattern = new RegExp(`${escapeRegExp(encodedTarget)}\\?v=[^"\\s>]+`, 'g');
        updated = updated.replace(encodedQueryPattern, encodedVersioned);
      }
      ['','./','/'].forEach((prefix) => {
        const prefixedTarget = `${prefix}${target}`;
        const prefixedPattern = new RegExp(`${escapeRegExp(prefixedTarget)}(?!\\?v)`, 'g');
        const prefixedReplacement = `${prefix}${info.versioned}`;
        updated = updated.replace(prefixedPattern, prefixedReplacement);
        if (encodedTarget !== target) {
          const prefixedEncodedTarget = `${prefix}${encodedTarget}`;
          const prefixedEncodedPattern = new RegExp(`${escapeRegExp(prefixedEncodedTarget)}(?!\\?v)`, 'g');
          const prefixedEncodedReplacement = `${prefix}${encodedVersioned}`;
          updated = updated.replace(prefixedEncodedPattern, prefixedEncodedReplacement);
        }
      });
    });
    });

    if (updated !== content) {
      writeFileSync(absPath, updated);
      console.log(`Updated asset references in ${relativePath}`);
    }
  });

  console.log('Minified assets and updated cache-busted references.');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

