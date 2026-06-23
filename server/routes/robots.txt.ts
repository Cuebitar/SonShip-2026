import { normalizeSiteUrl } from '~/lib/site'

const allowedPaths = ['/', '/about', '/register']

const userAgents = ['*', 'GPTBot', 'Claude-Web', 'PerplexityBot']

function buildCrawlRules(): string[] {
  return [
    'Disallow: /',
    ...allowedPaths.map((path) =>
      path === '/' ? 'Allow: /$' : `Allow: ${path}$`
    ),
  ]
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = normalizeSiteUrl(config.public.siteUrl)

  setHeader(event, 'content-type', 'text/plain; charset=utf-8')

  return [
    ...userAgents.flatMap((agent) => [
      `User-agent: ${agent}`,
      ...buildCrawlRules(),
      '',
    ]),
    `Sitemap: ${siteUrl}/sitemap.xml`,
  ].join('\n')
})
