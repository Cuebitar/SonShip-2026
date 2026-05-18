import { normalizeSiteUrl } from '~/lib/site'

const privatePaths = [
  '/admin',
  '/dashboard',
  '/friends',
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
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: Claude-Web',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`
  ].join('\n')
})
