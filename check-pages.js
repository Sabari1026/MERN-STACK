const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
console.log('Total lines in index.html:', lines.length);

const aboutHtml = fs.readFileSync('about/index.html', 'utf8');
console.log('about/index.html has _aboutHero_n3z96_1:', aboutHtml.includes('_aboutHero_n3z96_1'));
console.log('about/index.html has Not just another job board:', aboutHtml.includes('Not just another job board'));
console.log('index.html has _aboutHero_n3z96_1:', html.includes('_aboutHero_n3z96_1'));
console.log('index.html has Not just another job board:', html.includes('Not just another job board'));
