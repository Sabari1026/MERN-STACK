const fs = require('fs');

function updateCases(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  html = html.replace(/<title>.*?<\/title>/, '<title>Talent Match — Explainable Engineering &amp; Product Matching | HireConnect</title>');
  html = html.replace('<script type="module" src="/_nuxt/45snm2vD.js" crossorigin></script>', '<!-- Nuxt bundle omitted for dedicated Talent Match page -->');
  
  if (!html.includes('/* Hide intro and loading overlays')) {
    html = html.replace('<link rel="stylesheet" href="/shared-account-menu.css">', '<style>\n/* Hide intro and loading overlays on static page */\n._intro_5y7p3_1, ._loading_18egs_1 { display: none !important; opacity: 0 !important; pointer-events: none !important; }\n</style>\n<link rel="stylesheet" href="/shared-account-menu.css">');
  }

  const startTag = '<header class="_header_6o09i_1">';
  const endTag = '</header>';
  const startIdx = html.indexOf(startTag);
  const endIdx = html.indexOf(endTag);

  if (startIdx > -1 && endIdx > -1) {
    const replacement = '<div class="hc-page-wrap"><div class="hc-page-container" id="hc-talent-match-app"><div class="tm-loading-state"><div class="hc-spinner"></div><p>Initializing Talent Match...</p></div></div></div><script src="/_nuxt/talent-match-engine.js" defer></script>';
    html = html.substring(0, startIdx) + replacement + html.substring(endIdx + endTag.length);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully updated:', filePath);
}

updateCases('cases/index.html');
updateCases('blueprintapps.io/cases/index.html');
