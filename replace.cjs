const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');
const componentsDir = path.join(dir, 'components');

const filesToProcess = [
  path.join(dir, 'App.tsx'),
  ...fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx')).map(f => path.join(componentsDir, f))
];

filesToProcess.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace background colors with purple dark variants
  content = content.replace(/dark:bg-\[#0f051c\]/g, 'dark:bg-[#06000c]');
  content = content.replace(/dark:bg-\[#160729\]/g, 'dark:bg-[#0a0212]');
  
  // also handle the cards / transparent backgrounds
  content = content.replace(/dark:bg-\[#160729\]\/40/g, 'dark:bg-[#0a0212]/40');
  content = content.replace(/dark:bg-\[#160729\]\/60/g, 'dark:bg-[#0a0212]/60');
  content = content.replace(/dark:bg-\[#0f051c\]\/95/g, 'dark:bg-[#06000c]/95');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
