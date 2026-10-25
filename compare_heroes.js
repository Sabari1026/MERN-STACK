const fs = require('fs');
const a = fs.readFileSync('about/index.html', 'utf8');
const s = fs.readFileSync('signup/index.html', 'utf8');

const aIdx = a.indexOf('id="hc-auth-root"');
const sIdx = s.indexOf('id="hc-auth-root"');

console.log('About snippet:\n', a.slice(aIdx - 100, aIdx + 120));
console.log('---');
console.log('Signup snippet:\n', s.slice(sIdx - 100, sIdx + 120));

// Check end of hc-auth-root
const aEnd = a.indexOf('</form>', aIdx);
const sEnd = s.indexOf('</form>', sIdx);

console.log('About form end:\n', a.slice(aEnd, aEnd + 120));
console.log('---');
console.log('Signup form end:\n', s.slice(sEnd, sEnd + 120));
