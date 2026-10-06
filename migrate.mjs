import fs from 'fs/promises';
import path from 'path';

const DIST_DIR = '../dist';
const APP_DIR = './app';
const PUBLIC_ASSETS_DIR = './public/assets';

function htmlToJsx(html) {
  let jsx = html;
  
  // Replace class= with className=
  jsx = jsx.replace(/class=/g, 'className=');
  // Replace for= with htmlFor=
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  // Handle self-closing tags
  const voidTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'source', 'col'];
  for (const tag of voidTags) {
    const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
    jsx = jsx.replace(regex, `<${tag}$1 />`);
  }

  // Handle a href links
  jsx = jsx.replace(/href="([^"]+)\.html"/g, 'href="/$1"');
  jsx = jsx.replace(/href="index\.html"/g, 'href="/"');
  jsx = jsx.replace(/href="\/(index)?"/g, 'href="/"');
  jsx = jsx.replace(/href='([^']+)\.html'/g, 'href="/$1"');

  // React specific attributes
  jsx = jsx.replace(/fetchpriority=/g, 'fetchPriority=');
  jsx = jsx.replace(/aria-label=/g, 'aria-label=');
  jsx = jsx.replace(/aria-expanded=/g, 'aria-expanded=');
  jsx = jsx.replace(/aria-current=/g, 'aria-current=');
  jsx = jsx.replace(/tabindex=/g, 'tabIndex=');
  jsx = jsx.replace(/stroke-width=/g, 'strokeWidth=');
  jsx = jsx.replace(/stroke-linecap=/g, 'strokeLinecap=');
  jsx = jsx.replace(/stroke-linejoin=/g, 'strokeLinejoin=');
  
  // inline styles if any
  // e.g. style="display: none;" -> style={{display: 'none'}}
  // for this basic project, there are unlikely to be many complex inline styles.
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = p1.split(';').filter(Boolean).map(s => {
      const [key, value] = s.split(':').map(str => str.trim());
      if (!key) return '';
      const camelKey = key.replace(/-([a-z])/g, g => g[1].toUpperCase());
      return `${camelKey}: '${value}'`;
    }).join(', ');
    return `style={{ ${styleObj} }}`;
  });

  return jsx;
}

async function extractSection(html, tagName) {
  const startTag = `<${tagName}`;
  const endTag = `</${tagName}>`;
  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return '';
  const endIndex = html.indexOf(endTag, startIndex);
  if (endIndex === -1) return '';
  let content = html.slice(startIndex, endIndex + endTag.length);
  // remove the outer tag
  content = content.replace(new RegExp(`^<${tagName}[^>]*>`), '');
  content = content.replace(new RegExp(`</${tagName}>$`), '');
  return content.trim();
}

async function migrate() {
  const files = await fs.readdir(DIST_DIR);
  const htmlFiles = files.filter(f => f.endsWith('.html'));
  
  for (const file of htmlFiles) {
    const filePath = path.join(DIST_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract main content
    let mainContent = await extractSection(content, 'main');
    
    // Skip if no main content (e.g. maybe it's just a fragment)
    if (!mainContent) {
        console.warn(`No <main> tag found in ${file}`);
        continue;
    }
    
    mainContent = htmlToJsx(mainContent);
    
    const pageName = file.replace('.html', '');
    const isIndex = pageName === 'index';
    
    const componentCode = `export default function ${isIndex ? 'Home' : pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, '')}() {\n  return (\n    <main>\n      ${mainContent}\n    </main>\n  );\n}\n`;
    
    const targetDir = isIndex ? APP_DIR : path.join(APP_DIR, pageName);
    await fs.mkdir(targetDir, { recursive: true });
    
    await fs.writeFile(path.join(targetDir, 'page.tsx'), componentCode);
    console.log(`Created route for ${pageName}`);
  }
  
  // Extract Header and Footer from index.html for Layout
  const indexContent = await fs.readFile(path.join(DIST_DIR, 'index.html'), 'utf-8');
  let headerContent = await extractSection(indexContent, 'header');
  let footerContent = await extractSection(indexContent, 'footer');
  let asideContent = await extractSection(indexContent, 'aside');

  const fullHeaderHtml = `<aside className="concept-note">${htmlToJsx(asideContent)}</aside>\n<header className="site-head">${htmlToJsx(headerContent)}</header>`;
  
  // Read site.js
  const jsContent = await fs.readFile(path.join(DIST_DIR, 'assets', 'site.js'), 'utf-8');
  
  // We'll create a Client component for Navigation
  const navComponentCode = `"use client";
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  useEffect(() => {
    const button = document.querySelector('.menu');
    const nav = document.querySelector('.nav-links');
    if(!button || !nav) return;
    
    const setOpen = (open) => {
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      button.textContent = open ? '×' : '☰';
      if(open) nav.setAttribute('data-open', '');
      else nav.removeAttribute('data-open');
    };
    
    const clickHandler = () => setOpen(button.getAttribute('aria-expanded') !== 'true');
    button.addEventListener('click', clickHandler);
    
    const navClickHandler = (event) => {
      if(event.target.closest('a')) setOpen(false);
    };
    nav.addEventListener('click', navClickHandler);
    
    const keyHandler = (event) => {
      if(event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    
    return () => {
      button.removeEventListener('click', clickHandler);
      nav.removeEventListener('click', navClickHandler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, []);

  return (
    <>
      ${fullHeaderHtml}
    </>
  );
}
`;
  await fs.writeFile(path.join(APP_DIR, 'Navigation.tsx'), navComponentCode);

  const footerComponentCode = `import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      ${htmlToJsx(footerContent)}
    </footer>
  );
}
`;
  await fs.writeFile(path.join(APP_DIR, 'Footer.tsx'), footerComponentCode);
  
  // Replace layout.tsx
  const layoutCode = `import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "./Navigation";
import Footer from "./Footer";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--sans",
});

export const metadata: Metadata = {
  title: "Tax research with the source in view · GAIN Tax",
  description: "AI-assisted UK tax research for professionals. Clear answers, connected to legislation and HMRC guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB">
      <body className={dmSans.className}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
`;
  await fs.writeFile(path.join(APP_DIR, 'layout.tsx'), layoutCode);

  // Copy globals.css
  const cssContent = await fs.readFile(path.join(DIST_DIR, 'assets', 'site.css'), 'utf-8');
  await fs.writeFile(path.join(APP_DIR, 'globals.css'), cssContent);
  
  // Copy assets
  await fs.mkdir(PUBLIC_ASSETS_DIR, { recursive: true });
  const assets = await fs.readdir(path.join(DIST_DIR, 'assets'));
  for (const asset of assets) {
    if (asset.endsWith('.png') || asset.endsWith('.jpg') || asset.endsWith('.svg')) {
      await fs.copyFile(
        path.join(DIST_DIR, 'assets', asset),
        path.join(PUBLIC_ASSETS_DIR, asset)
      );
    }
  }

  console.log("Migration script completed.");
}

migrate().catch(console.error);
