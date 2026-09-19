import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const configData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/config.json'), 'utf8'));
const portfolioData = JSON.parse(fs.readFileSync(path.join(rootDir, 'src/data/portfolio.json'), 'utf8'));

const getLocalFileUrl = (urlPath) => {
  if (urlPath.startsWith('http')) return urlPath;
  const absPath = path.join(rootDir, 'public', decodeURIComponent(urlPath));
  return `file:///${absPath.replace(/\\/g, '/')}`;
};

const generateHtml = () => {
  let itemsHtml = '';

  portfolioData.forEach((item) => {
    const thumbItem = item.items[0];
    let thumbHtml = '';
    
    const liveUrl = `https://creative-portfolio-lac-iota.vercel.app/category/${encodeURIComponent(item.category)}`;

    if (thumbItem.type === 'image') {
      thumbHtml = `<img src="${getLocalFileUrl(thumbItem.url)}" class="thumb" />`;
    } else if (thumbItem.type === 'video' && thumbItem.isGoogleDrive) {
      thumbHtml = `<div class="thumb video-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
        <span>Google Drive Video</span>
      </div>`;
    } else if (thumbItem.type === 'video') {
      thumbHtml = `<div class="thumb video-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
        <span>Video Project</span>
      </div>`;
    } else if (thumbItem.type === 'document') {
      thumbHtml = `<div class="thumb doc-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span>PDF Document</span>
      </div>`;
    }

    itemsHtml += `
      <div class="project">
        <a href="${liveUrl}" class="project-link" target="_blank">
          <div class="thumb-container">
            ${thumbHtml}
          </div>
          <div class="project-info">
            <h2>${item.title}</h2>
            <div class="tags">
              <span class="tag cat">${item.category}</span>
              ${item.isHealthCommunication ? `<span class="tag hc">Health Comm</span>` : ''}
              ${item.type === 'gallery' ? `<span class="tag gal">Gallery</span>` : ''}
            </div>
            <p>${item.description || 'View full project details and interactive media on the live website.'}</p>
            <div class="view-live">Click to view on live site →</div>
          </div>
        </a>
      </div>
    `;
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Portfolio - ${configData.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          line-height: 1.5;
          padding: 40px;
          background: #ffffff;
        }
        
        .header {
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 30px;
          margin-bottom: 40px;
        }
        
        h1 {
          font-size: 42px;
          font-weight: 800;
          color: #111827;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        
        .role {
          font-size: 20px;
          font-weight: 600;
          color: #059669;
          margin-bottom: 16px;
        }
        
        .bio {
          font-size: 15px;
          color: #4b5563;
          max-width: 800px;
          margin-bottom: 24px;
          line-height: 1.6;
        }
        
        .contact {
          display: flex;
          gap: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .contact a {
          color: #2563eb;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
        }
        
        .project {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          page-break-inside: avoid;
          background: #f9fafb;
        }
        
        .project-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .thumb-container {
          width: 100%;
          height: 220px;
          background: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .video-placeholder, .doc-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #e5e7eb;
          color: #6b7280;
          font-weight: 600;
          font-size: 14px;
          gap: 8px;
        }
        
        .project-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        
        .project-info h2 {
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .tag {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .tag.cat { background: #e5e7eb; color: #4b5563; }
        .tag.hc { background: #d1fae5; color: #047857; }
        .tag.gal { background: #ede9fe; color: #6d28d9; }
        
        .project-info p {
          font-size: 13px;
          color: #6b7280;
          flex-grow: 1;
          margin-bottom: 16px;
        }
        
        .view-live {
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          margin-top: auto;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${configData.name}</h1>
        <div class="role">${configData.role}</div>
        <div class="bio">${configData.bio}</div>
        <div class="contact">
          <a href="mailto:${configData.email}">✉️ ${configData.email}</a>
          <a href="${configData.linkedin}">🔗 LinkedIn Profile</a>
          <a href="https://creative-portfolio-lac-iota.vercel.app/">🌐 Live Website Portfolio</a>
        </div>
      </div>
      
      <div class="grid">
        ${itemsHtml}
      </div>
    </body>
    </html>
  `;
};

(async () => {
  console.log('Generating PDF Portfolio...');
  
  const html = generateHtml();
  const pdfPath = path.join(rootDir, 'Juan_Javier_Bonnin_Portfolio.pdf');
  const tempHtmlPath = path.join(rootDir, 'temp-pdf-render.html');

  try {
    fs.writeFileSync(tempHtmlPath, html, 'utf8');
    
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--allow-file-access-from-files']
    });
    const page = await browser.newPage();
    
    await page.goto(`file:///${tempHtmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
    
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        bottom: '20px',
        left: '20px',
        right: '20px'
      }
    });
    
    await browser.close();
    fs.unlinkSync(tempHtmlPath);
    console.log(`✅ Successfully generated: ${pdfPath}`);
  } catch (err) {
    console.error('Error generating PDF:', err);
    if (fs.existsSync(tempHtmlPath)) fs.unlinkSync(tempHtmlPath);
  }
})();
