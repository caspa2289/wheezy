import page from './index.html'

const server = Bun.serve({
    port: 6969,
    routes: {
        '/': page,
        '/static/*': (req) => {
            const url = new URL(req.url)
            return new Response(
                Bun.file(
                    import.meta.dir +
                        '/assets' +
                        url.pathname.slice('/static'.length)
                )
            )
        },
    },
})

console.log(`Wheezy demos dev server: http://localhost:${server.port}`)
