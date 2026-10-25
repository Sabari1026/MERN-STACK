const fs = require('fs');

let html = fs.readFileSync('about/index.html', 'utf8');

// Title
html = html.replace('<title>About Us | HireConnect</title>', '<title>Account Settings | HireConnect</title>');

// Remove about hero & collage
const startHero = '<header class="_header_7spyy_1">';
const endHero = '</header>';
const startIdx = html.indexOf(startHero);
const endIdx = html.indexOf(endHero, startIdx);

// Remove promise section
const startPromise = '<section class="_ourPromise_7spyy_5">';
const endPromise = '</section>';
const pStartIdx = html.indexOf(startPromise);
const pEndIdx = html.indexOf(endPromise, pStartIdx);

// Settings page body HTML
const settingsPageHtml = `
<div class="hc-page-wrap">
  <div class="hc-page-container" id="hc-settings-app">
    <div style="text-align: center; padding: 60rem 20rem; color: #888;">
      <div class="hc-spinner" style="margin: 0 auto 16rem; width: 32rem; height: 32rem; border-width: 3rem;"></div>
      <p style="font-size: 15rem; color: #fff;">Loading account settings...</p>
    </div>
  </div>
</div>
<script src="/_nuxt/settings-engine.js" defer></script>
`;

if (startIdx !== -1 && pEndIdx !== -1) {
  const finalHtml = html.slice(0, startIdx) + settingsPageHtml + html.slice(pEndIdx + endPromise.length);
  fs.writeFileSync('settings/index.html', finalHtml);
  fs.writeFileSync('blueprintapps.io/settings/index.html', finalHtml);
  console.log('Successfully wrote settings/index.html & mirror, size:', finalHtml.length);
} else {
  console.error('Could not locate markers', startIdx, pEndIdx);
}
