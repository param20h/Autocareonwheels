import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SERVICES_DATA } from './src/data/servicesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, 'dist');
const BASE_URL = 'https://www.autocareonwheels.com.au';

if (!fs.existsSync(DIST_DIR)) {
  console.error('dist directory not found. Please run vite build first.');
  process.exit(1);
}

const templatePath = path.resolve(DIST_DIR, 'index.html');
const templateHtml = fs.readFileSync(templatePath, 'utf-8');

// Category metadata
const CATEGORIES = [
  {
    path: '/services/tyres',
    title: 'Mobile Tyre Fitting Canberra | Top Brands Fitted At Home or Work — AutoCare on Wheels',
    description: 'Mobile tyre fitting & puncture repair in Canberra. We supply & fit 30+ top brands (Michelin, Bridgestone, Pirelli & more) at your door. Same-day available.'
  },
  {
    path: '/services/car-services',
    title: 'Mobile Car Servicing Canberra | Logbook & Periodic Maintenance — AutoCare on Wheels',
    description: 'Professional mobile car servicing in Canberra and Queanbeyan. Logbook servicing, periodic inspections, and scheduled maintenance without workshop visits.'
  },
  {
    path: '/services/repairs',
    title: 'Mobile Mechanical Repairs Canberra | Brakes, Batteries, Alternators — AutoCare on Wheels',
    description: 'Fast, reliable mobile mechanical repairs in Canberra. On-site diagnostics, brake replacements, alternator & starter motor repairs at your home or workplace.'
  }
];

// Static pages metadata
const STATIC_PAGES = [
  {
    path: '/contact',
    title: 'Contact Us | AutoCare on Wheels — Mobile Mechanic Canberra',
    description: 'Contact AutoCare on Wheels for reliable mobile car servicing, mechanical repairs, and tyre fitting across Canberra and Queanbeyan. Call 0427 563 913 or send an enquiry.'
  },
  {
    path: '/book',
    title: 'Book a Mobile Mechanic | AutoCare on Wheels — Canberra & Queanbeyan',
    description: 'Book a mobile mechanic in Canberra or Queanbeyan online with AutoCare on Wheels. Choose tyre fitting, logbook servicing, or repairs at your location.'
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | AutoCare on Wheels',
    description: 'Privacy Policy for AutoCare on Wheels. Learn how we handle your personal and vehicle data.'
  },
  {
    path: '/terms',
    title: 'Terms of Service | AutoCare on Wheels',
    description: 'Terms of Service and conditions for AutoCare on Wheels mobile mechanic and tyre services.'
  }
];

// Service pages metadata
const SERVICE_PAGES = SERVICES_DATA.map(service => ({
  path: `/services/${service.slug}`,
  title: service.metaTitle,
  description: service.metaDescription,
  schema: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${BASE_URL}/services/${service.slug}#service`,
        'name': service.title,
        'serviceType': service.shortTitle,
        'description': service.metaDescription,
        'provider': {
          '@type': 'AutoRepair',
          'name': 'AutoCare on Wheels',
          'telephone': '0427563913',
          'url': BASE_URL
        },
        'areaServed': [
          { '@type': 'City', 'name': 'Canberra' },
          { '@type': 'City', 'name': 'Queanbeyan' }
        ]
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${BASE_URL}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': service.categoryName,
            'item': `${BASE_URL}/services/${service.category}`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': service.shortTitle,
            'item': `${BASE_URL}/services/${service.slug}`
          }
        ]
      }
    ]
  }
}));

const allPages = [...CATEGORIES, ...STATIC_PAGES, ...SERVICE_PAGES];

console.log(`Starting SEO pre-generation for ${allPages.length} routes...`);

for (const page of allPages) {
  const canonicalUrl = `${BASE_URL}${page.path}`;
  let html = templateHtml;

  // 1. Update Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`);

  // 2. Update Meta Description
  html = html.replace(
    /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
    `<meta name="description" content="${page.description.replace(/"/g, '&quot;')}" />`
  );

  // 3. Update Canonical Tag
  html = html.replace(
    /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // 4. Update Open Graph and Twitter
  html = html.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${page.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${page.description.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${page.title.replace(/"/g, '&quot;')}" />`
  );
  html = html.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${page.description.replace(/"/g, '&quot;')}" />`
  );

  // 5. Inject Schema if provided
  if (page.schema) {
    const schemaScript = `\n  <script type="application/ld+json" id="route-schema">\n  ${JSON.stringify(page.schema, null, 2)}\n  </script>`;
    html = html.replace('</head>', `${schemaScript}\n</head>`);
  }

  // Create directory and write index.html
  const pageDir = path.join(DIST_DIR, page.path.replace(/^\//, ''));
  fs.mkdirSync(pageDir, { recursive: true });
  fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');
  console.log(`  [SEO] Created: ${page.path}/index.html -> canonical: ${canonicalUrl}`);
}

console.log(`Successfully pre-generated ${allPages.length} route HTML files with exact canonical URLs and metadata!`);
