const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('For Employers')) {
        const updated = content
          .replace(/data-text="For Employers"/g, 'data-text="Talent Match"')
          .replace(/<span>For Employers<\/span>/g, '<span>Talent Match</span>')
          .replace(/>For Employers<\/a>/g, '>Talent Match</a>');
        
        if (updated !== content) {
          fs.writeFileSync(fullPath, updated, 'utf8');
          console.log('Updated:', fullPath);
        }
      }
    }
  }
}

processDir('.');
console.log('All HTML files updated with Talent Match in navbar, mobile menu & footer.');
