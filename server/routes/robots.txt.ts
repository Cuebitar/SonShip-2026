const privatePaths = [
  '/admin',
  '/dashboard',
  '/friends',
  '/gallery',
  '/games',
  '/letters',
  '/login',
  '/messages',
  '/profile',
  '/schedule'
]

export default defineEventHandler((event) => {
  const origin = getRequestURL(event).origin

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    ...privatePaths.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${origin}/sitemap.xml`
  ].join('\n')
})
