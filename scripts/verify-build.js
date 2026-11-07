const fs = require('fs');
const path = require('path');
for (const f of ['index.html','game.js','style.css']) {
  if (!fs.existsSync(path.join('www', f))) throw new Error('Missing www/' + f);
}
console.log('Gugu Kingdom web assets verified.');
