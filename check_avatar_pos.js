const { execSync } = require('child_process');
const edgeExe = '"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"';

// Add a script in index.html or check via console output
const script = `
  const el = document.getElementById('hc-floating-avatar-container');
  if (el) {
    const r = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    console.log('AVATAR_BOUNDS:' + JSON.stringify(r));
    console.log('AVATAR_STYLE: zIndex=' + style.zIndex + ', display=' + style.display + ', visibility=' + style.visibility + ', top=' + style.top + ', right=' + style.right + ', width=' + style.width + ', height=' + style.height);
  } else {
    console.log('AVATAR_NOT_FOUND');
  }
`;

const cmd = `${edgeExe} --headless --disable-gpu --virtual-time-budget=2000 --window-size=390,844 --dump-dom "http://localhost:3000/?test_mobile=1"`;
const html = execSync(cmd).toString();
const hasAvatar = html.includes('hc-floating-avatar');
console.log('HTML has avatar?', hasAvatar);
