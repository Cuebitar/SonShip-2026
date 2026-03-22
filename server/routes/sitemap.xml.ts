const publicPages = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/activities', changefreq: 'weekly', priority: '0.8' }
]

export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin
  const lastModified = new Date().toISOString()

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')

  const urls = publicPages.map(({ path, changefreq, priority }) => `  <url>
    <loc>${origin}${path}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`
})
