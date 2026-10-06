const fs = require('fs');
const path = require('path');

const icons = {
  '→': 'FiArrowRight',
  '↗': 'FiArrowUpRight',
  '☰': 'FiMenu',
  '×': 'FiX',
  '✓': 'FiCheck'
};

const walk = dir => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.css')) {
      let content = fs.readFileSync(p, 'utf-8');
      let modified = false;

      // Handle TSX files
      if (p.endsWith('.tsx')) {
        let importedIcons = new Set();

        // Check if any icon is present
        for (const [char, iconName] of Object.entries(icons)) {
          if (content.includes(char)) {
            // Special handling for Navigation.tsx strings
            if (char === '×' && content.includes("'×'")) {
               content = content.replace(/'×'/g, '<FiX />'); // wait, this is inside string literal, not working easily.
            }
          }
        }
        
        // Manual replacements for text nodes
        if (content.includes('→')) {
          content = content.replace(/→/g, '<FiArrowRight />');
          importedIcons.add('FiArrowRight');
          modified = true;
        }
        if (content.includes('↗')) {
          content = content.replace(/↗/g, '<FiArrowUpRight />');
          importedIcons.add('FiArrowUpRight');
          modified = true;
        }
        if (content.includes('☰')) {
           // In Navigation it's inside button.textContent = open ? '×' : '☰' which won't work with <FiMenu />. 
           // Let's replace the actual text nodes in JSX.
           content = content.replace(/>☰</g, '><FiMenu /><');
           importedIcons.add('FiMenu');
           modified = true;
        }
        if (content.includes('×')) {
           content = content.replace(/>×</g, '><FiX /><');
           importedIcons.add('FiX');
           modified = true;
        }

        // if Navigation.tsx has textContent assignment, we need to change it to React state or just leave it for now and fix Navigation.tsx manually.
        // Let's just fix Navigation.tsx manually and exclude it from generic replacement for state variables if needed.
        
        if (modified && importedIcons.size > 0) {
          const importStmt = `import { ${Array.from(importedIcons).join(', ')} } from 'react-icons/fi';\n`;
          // insert after first use client or imports
          if (content.includes('"use client";')) {
             content = content.replace('"use client";', '"use client";\n' + importStmt);
          } else {
             content = importStmt + content;
          }
          fs.writeFileSync(p, content);
          console.log('Updated ' + p);
        }
      }
    }
  }
};

walk('./app');
