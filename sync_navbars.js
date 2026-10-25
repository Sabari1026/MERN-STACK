const fs = require('fs');
const path = require('path');

const TARGET_FILES = [
  'index.html',
  'services/index.html',
  'approach/index.html',
  'about/index.html',
  'cases/index.html',
  'contact/index.html',
  'privacy/index.html',
  'terms/index.html',
  'signup/index.html',
  'profile/index.html',
  'settings/index.html'
];

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing:', filePath);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Ensure shared-account-menu.css is in <head>
  if (!content.includes('shared-account-menu.css')) {
    content = content.replace('</head>', '<link rel="stylesheet" href="/shared-account-menu.css">\n</head>');
    changed = true;
  }

  // 2. Ensure shared-account-menu.js is loaded
  if (!content.includes('shared-account-menu.js')) {
    content = content.replace('</body>', '<script src="/shared-account-menu.js" defer></script>\n</body>');
    changed = true;
  }

  // 3. Remove static Sign In from desktop nav items
  // <a ...href="/about/"...class="..._item_p8o7m_41...">...Sign In...</a>
  const regexDesktopSignIn = /<a[^>]*href="\/about\/"[^>]*class="[^"]*_item_p8o7m_41[^"]*"[^>]*>[\s\S]*?<\/a>/gi;
  if (regexDesktopSignIn.test(content)) {
    content = content.replace(regexDesktopSignIn, '');
    changed = true;
  }

  // 4. Remove static Sign In from mobile menu items
  // <a ...href="/about/"...class="[^"]*_item_1lkeu_28[^"]*">Sign In<\/a>
  const regexMobileSignIn = /<a[^>]*href="\/about\/"[^>]*class="[^"]*_item_1lkeu_28[^"]*"[^>]*>Sign In<\/a>/gi;
  if (regexMobileSignIn.test(content)) {
    content = content.replace(regexMobileSignIn, '');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  } else {
    console.log('Already clean:', filePath);
  }

  // Mirror to blueprintapps.io/
  const mirrorPath = path.join('blueprintapps.io', filePath);
  const mirrorDir = path.dirname(mirrorPath);
  if (!fs.existsSync(mirrorDir)) {
    fs.mkdirSync(mirrorDir, { recursive: true });
  }
  fs.writeFileSync(mirrorPath, content, 'utf8');
}

for (const f of TARGET_FILES) {
  processFile(f);
}
console.log('Finished syncing all page navbars and mirrors.');
