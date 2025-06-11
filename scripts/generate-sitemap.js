// scripts/generate-sitemap.js
import { SitemapStream } from 'sitemap';
import { createWriteStream, writeFileSync } from 'fs';
import { resolve } from 'path';

// Your website URL (change this when deploying)
const SITE_URL = 'http://localhost:5173'; // Vite default port

// Define your routes based on your actual project structure
const routes = [
  // Main public pages
  { url: '/', priority: 1.0, changefreq: 'weekly', isProtected: false },
  { url: '/login', priority: 0.6, changefreq: 'monthly', isProtected: false },
  { url: '/signup', priority: 0.6, changefreq: 'monthly', isProtected: false },
  
  // Landing page sections (if they have separate routes)
  // { url: '/features', priority: 0.8, changefreq: 'monthly', isProtected: false },
  // { url: '/pricing', priority: 0.8, changefreq: 'monthly', isProtected: false },
  
  // Protected routes (will be excluded from sitemap)
  { url: '/auth-success', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/analyze', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/convert', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/document', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/optimize', priority: 0.3, changefreq: 'never', isProtected: true },
  
  // Add any other public pages you might have
  // { url: '/about', priority: 0.7, changefreq: 'monthly', isProtected: false },
  // { url: '/contact', priority: 0.6, changefreq: 'monthly', isProtected: false },
  // { url: '/privacy', priority: 0.4, changefreq: 'yearly', isProtected: false },
  // { url: '/terms', priority: 0.4, changefreq: 'yearly', isProtected: false },
];

async function generateSitemap() {
  console.log('🚀 Generating sitemap for CodeOpt...');
  
  try {
    // Filter out protected routes
    const publicRoutes = routes.filter(route => !route.isProtected);
    
    console.log(`📄 Found ${publicRoutes.length} public routes`);
    console.log(`🔒 Excluded ${routes.length - publicRoutes.length} protected routes`);
    
    // Create sitemap stream
    const sitemap = new SitemapStream({ hostname: SITE_URL });
    
    // Create write stream to public folder
    const writeStream = createWriteStream(resolve('public/sitemap.xml'));
    sitemap.pipe(writeStream);
    
    // Add each public route to sitemap
    publicRoutes.forEach(route => {
      console.log(`✅ Adding: ${route.url}`);
      sitemap.write({
        url: route.url,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: new Date().toISOString()
      });
    });
    
    // End the sitemap stream
    sitemap.end();
    
    // Wait for the sitemap to be written
    await new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (error) => reject(error));
    });
    
    console.log('✅ Sitemap generated successfully at public/sitemap.xml');
    console.log(`🔗 Available at: ${SITE_URL}/sitemap.xml`);
    
    // Generate robots.txt as well
    generateRobotsTxt();
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

function generateRobotsTxt() {
  const robotsTxt = `User-agent: *
Allow: /

# Disallow protected/private areas
Disallow: /auth-success
Disallow: /results/

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml`;

  writeFileSync(resolve('public/robots.txt'), robotsTxt);
  console.log('✅ robots.txt updated successfully at public/robots.txt');
}

// Run the generator
generateSitemap();