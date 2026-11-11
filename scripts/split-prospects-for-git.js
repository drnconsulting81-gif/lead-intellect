const fs = require('fs');
const path = require('path');

const prospectsPath = path.join(__dirname, '../data/prospects.json');
console.log('Reading prospects.json for chunking...');
const prospects = JSON.parse(fs.readFileSync(prospectsPath, 'utf8'));
console.log(`Loaded ${prospects.length} prospects.`);

const CHUNK_COUNT = 3;
const chunkSize = Math.ceil(prospects.length / CHUNK_COUNT);

for (let i = 0; i < CHUNK_COUNT; i++) {
  const chunk = prospects.slice(i * chunkSize, (i + 1) * chunkSize);
  const partPath = path.join(__dirname, `../data/prospects_part${i + 1}.json`);
  
  // Stream write chunk
  const ws = fs.createWriteStream(partPath, { encoding: 'utf8' });
  ws.write('[\n');
  for (let j = 0; j < chunk.length; j++) {
    const isLast = j === chunk.length - 1;
    ws.write('  ' + JSON.stringify(chunk[j]) + (isLast ? '\n' : ',\n'));
  }
  ws.write(']\n');
  ws.end();
  
  console.log(`✓ Wrote prospects_part${i + 1}.json with ${chunk.length} records.`);
}

