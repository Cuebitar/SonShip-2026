import { normalizeSiteUrl } from '~/lib/site'

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
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    'User-agent: *',
    'Allow: /',
    ...privatePaths.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`
  ].join('\n')
})
