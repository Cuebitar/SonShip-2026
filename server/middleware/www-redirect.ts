// server/middleware/www-redirect.ts
export default defineEventHandler((event) => {
    const host = getRequestHost(event)

    if (host?.startsWith('www.')) {
        const proto = getRequestHeader(event, 'x-forwarded-proto') || 'https'
        const newHost = host.replace('www.', '')
        const url = event.node.req.url || '/'
        
        return sendRedirect(event, `${proto}://${newHost}${url}`, 301)
    }
})