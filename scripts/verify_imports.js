const fs = require('fs');
const path = require('path');

function checkImports(dir) {
  let errors = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      errors = errors.concat(checkImports(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.jsx'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, lineNo) => {
        // match from '...' or require('...')
        const match = line.match(/(?:from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/);
        if (match) {
          const importTarget = match[1] || match[2];
          if (importTarget.startsWith('.')) {
            const dirName = path.dirname(fullPath);
            const resolvedBase = path.resolve(dirName, importTarget);
            const extensions = ['', '.js', '.jsx', '.json', '.css', '/index.js', '/index.jsx'];
            const exists = extensions.some(ext => fs.existsSync(resolvedBase + ext));
            if (!exists) {
              errors.push({ file: fullPath, line: lineNo + 1, target: importTarget });
            }
          }
        }
      });
    }
  }
  return errors;
}

const feErrors = checkImports(path.resolve('frontend/src'));
const beErrors = checkImports(path.resolve('backend/src'));

console.log('=== RELATIVE IMPORT VALIDATION ===');
console.log('Frontend broken relative imports:', feErrors.length ? JSON.stringify(feErrors, null, 2) : 'None (0)');
console.log('Backend broken relative imports:', beErrors.length ? JSON.stringify(beErrors, null, 2) : 'None (0)');

if (feErrors.length || beErrors.length) {
  process.exit(1);
} else {
  console.log('ALL IMPORTS RESOLVE VALID FILES.');
}
