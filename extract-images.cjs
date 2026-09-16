const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('C:/Users/6755G/.gemini/antigravity-ide/brain/5956ea48-6302-4afd-bb2e-51ab5bc569c3/.system_generated/logs/transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let topImgBase64 = null;
  let bottomImgBase64 = null;

  for await (const line of rl) {
    if (line.includes('topImg.src = \\"data:image/jpeg;base64,')) {
      const topMatch = line.match(/topImg\.src\s*=\s*\\"data:image\/jpeg;base64,([^\\"]+)\\"/);
      if (topMatch) topImgBase64 = topMatch[1];
    }
    if (line.includes('bottomImg.src = \\"data:image/jpeg;base64,')) {
      const bottomMatch = line.match(/bottomImg\.src\s*=\s*\\"data:image\/jpeg;base64,([^\\"]+)\\"/);
      if (bottomMatch) bottomImgBase64 = bottomMatch[1];
    }
    
    if (topImgBase64 && bottomImgBase64) {
      console.log('Found both! Writing...');
      const topBuffer = Buffer.from(topImgBase64, 'base64');
      const bottomBuffer = Buffer.from(bottomImgBase64, 'base64');
      
      fs.writeFileSync('C:/Users/6755G/OneDrive/Desktop/Portfolio Sahil/public/grunge-top.png', topBuffer);
      fs.writeFileSync('C:/Users/6755G/OneDrive/Desktop/Portfolio Sahil/public/grunge-bottom.png', bottomBuffer);
      console.log('Done!');
      break;
    }
  }
}

processLineByLine();
