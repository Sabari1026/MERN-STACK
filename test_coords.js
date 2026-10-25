const http = require('http');
const { execSync } = require('child_process');

// Let's inject a tiny console.log into index.html or check with a small script
const code = `
  const el = document.getElementById('hc-floating-avatar-container');
  if (el) {
    const r = el.getBoundingClientRect();
    const s = window.getComputedStyle(el);
    console.log('BOX:', JSON.stringify(r), 'Z:', s.zIndex, 'POS:', s.position, 'TOP:', s.top, 'RIGHT:', s.right, 'DISPLAY:', s.display, 'OPACITY:', s.opacity);
  } else {
    console.log('EL NOT FOUND');
  }
`;
console.log('Testing...');
