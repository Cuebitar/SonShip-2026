import { normalizeSiteUrl } from '~/lib/site'

export default defineEventHandler((event) => {
    if (import.meta.dev) {
        return
    }

    const config = useRuntimeConfig(event)
    const canonicalSiteUrl = new URL(normalizeSiteUrl(config.public.siteUrl))
    const requestUrl = getRequestURL(event)

    if (requestUrl.host !== canonicalSiteUrl.host || requestUrl.protocol !== canonicalSiteUrl.protocol) {
        const targetUrl = `${canonicalSiteUrl.origin}${requestUrl.pathname}${requestUrl.search}`
        return sendRedirect(event, targetUrl, 301)
    }
})
