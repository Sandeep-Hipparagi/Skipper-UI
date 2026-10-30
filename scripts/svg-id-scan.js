const fs = require('fs');
const path = require('path');
const dir = 'src/components/v1';
const files = fs.readdirSync(dir).filter(f => f.match(/^skipper\d+\.tsx$/));
const idMap = {};
const idRegex = /\bid="([^"]+)"/g;

for (const file of files) {
  const content = fs.readFileSync(path.join(dir, file), 'utf8');
  let m;
  idRegex.lastIndex = 0;
  while ((m = idRegex.exec(content)) !== null) {
    const id = m[1];
    if (!idMap[id]) idMap[id] = [];
    if (!idMap[id].includes(file)) idMap[id].push(file);
  }
}

const collisions = Object.entries(idMap).filter(([id, files]) => files.length > 1);
if (collisions.length === 0) {
  console.log('NO SVG ID COLLISIONS FOUND');
} else {
  console.log('COLLISIONS FOUND: ' + collisions.length);
  for (const [id, files] of collisions) {
    console.log(JSON.stringify({id, files}));
  }
}
console.log('Total unique IDs scanned: ' + Object.keys(idMap).length);
