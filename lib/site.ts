export const DEFAULT_SITE_URL = 'https://firelight.com.my'

export const normalizeSiteUrl = (siteUrl = DEFAULT_SITE_URL) =>
  siteUrl.replace(/\/+$/, '')

export const buildCanonicalUrl = (siteUrl: string, path = '/') =>
  new URL(path || '/', `${normalizeSiteUrl(siteUrl)}/`).toString()
