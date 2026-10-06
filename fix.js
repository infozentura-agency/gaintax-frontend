const fs = require('fs');
const path = require('path');

const walk = dir => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (p.endsWith('.tsx')) {
      let c = fs.readFileSync(p, 'utf-8');
      c = c.replace(/src="assets\//g, 'src="/assets/');
      c = c.replace(/href="assets\//g, 'href="/assets/');
      fs.writeFileSync(p, c);
    }
  }
};

walk('./app');
