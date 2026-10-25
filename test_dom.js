const { execSync } = require('child_process');
const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';
const cmd = `${edgeExe} --headless --disable-gpu --virtual-time-budget=2000 --window-size=390,844 --dump-dom "http://localhost:3000/"`;
const html = execSync(cmd).toString();
const idx = html.indexOf('hc-floating-avatar');
console.log('Found hc-floating-avatar at index:', idx);
if (idx !== -1) {
  console.log(html.substring(idx - 30, idx + 250));
}
