// scripts/generate-sitemap.js
import { createWriteStream, writeFileSync } from 'fs';
import { SitemapStream } from 'sitemap';
import { resolve } from 'path';

// Your website URL (change this when deploying to production)
const SITE_URL = process.env.SITE_URL || 'https://codeopt.ai'; // Update with your actual domain

// Define all routes from your codebase with proper SEO metadata
const routes = [
  // Main public pages (high priority)
  { url: '/', priority: 1.0, changefreq: 'weekly', isProtected: false },
  
  // Authentication pages (medium priority)
  { url: '/login', priority: 0.7, changefreq: 'monthly', isProtected: false },
  { url: '/signup', priority: 0.7, changefreq: 'monthly', isProtected: false },
  { url: '/auth/verify-otp', priority: 0.3, changefreq: 'never', isProtected: false },
  { url: '/auth/success', priority: 0.3, changefreq: 'never', isProtected: false },
  
  // Public footer/marketing pages (medium-high priority)
  { url: '/pricing', priority: 0.8, changefreq: 'monthly', isProtected: false },
  { url: '/contact', priority: 0.7, changefreq: 'monthly', isProtected: false },
  { url: '/blogs', priority: 0.6, changefreq: 'weekly', isProtected: false },
  { url: '/about', priority: 0.6, changefreq: 'monthly', isProtected: false },
  
  // Legal pages (lower priority but important for SEO)
  { url: '/privacy', priority: 0.4, changefreq: 'yearly', isProtected: false },
  { url: '/terms', priority: 0.4, changefreq: 'yearly', isProtected: false },
  { url: '/cookies', priority: 0.4, changefreq: 'yearly', isProtected: false },
  
  // Protected routes (excluded from sitemap but listed for reference)
  { url: '/profile', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/subscription', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/subscription/success', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/subscription/cancel', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/consultation/success', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/consultation/cancel', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/analyze', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/optimize', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/convert', priority: 0.3, changefreq: 'never', isProtected: true },
  { url: '/results/document', priority: 0.3, changefreq: 'never', isProtected: true },
  
  // Admin routes (excluded from sitemap)
  { url: '/admin/login', priority: 0.1, changefreq: 'never', isProtected: true },
  { url: '/admin/dashboard', priority: 0.1, changefreq: 'never', isProtected: true },
];

async function generateSitemap() {
  console.log('🚀 Generating sitemap for CodeOpt...');
  console.log(`🌐 Site URL: ${SITE_URL}`);
  
  try {
    // Filter out protected routes for sitemap
    const publicRoutes = routes.filter(route => !route.isProtected);
    const protectedRoutes = routes.filter(route => route.isProtected);
    
    console.log(`📄 Found ${publicRoutes.length} public routes for sitemap`);
    console.log(`🔒 Excluded ${protectedRoutes.length} protected routes`);
    
    // Create sitemap stream
    const sitemap = new SitemapStream({ hostname: SITE_URL });
    
    // Create write stream to public folder
    const writeStream = createWriteStream(resolve('public/sitemap.xml'));
    sitemap.pipe(writeStream);
    
    // Add each public route to sitemap
    publicRoutes.forEach(route => {
      console.log(`✅ Adding: ${route.url} (priority: ${route.priority}, changefreq: ${route.changefreq})`);
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
      writeStream.on('finish', () => {
        console.log('✅ Sitemap successfully written!');
        resolve(true);
      });
      writeStream.on('error', (error) => reject(error));
    });
    
    console.log(`🔗 Sitemap available at: ${SITE_URL}/sitemap.xml`);
    
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
Disallow: /auth/
Disallow: /profile
Disallow: /subscription
Disallow: /consultation
Disallow: /results/
Disallow: /admin/

# Allow important public pages
Allow: /login
Allow: /signup
Allow: /pricing
Allow: /contact
Allow: /blogs
Allow: /about
Allow: /privacy
Allow: /terms
Allow: /cookies

# Sitemap location
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay (optional - helps with server load)
Crawl-delay: 1`;

  writeFileSync(resolve('public/robots.txt'), robotsTxt);
  console.log('✅ robots.txt updated successfully at public/robots.txt');
}

generateSitemap();