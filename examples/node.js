const fs = require('fs');

document.body.innerHTML = fs.readFileSync('examples/node.js', 'utf-8');