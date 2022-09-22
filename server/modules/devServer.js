import { createServer } from "vite"
import { renderFrontend } from "../util.js"

export const viteDevServer = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
})

export function setupServer(expressApp) {
    expressApp.use(viteDevServer.middlewares)

    expressApp.get("/", async (req, res) => {

        // parse query params
        const context = Object.fromEntries(Object.entries(req.query).map(([key, val]) => {
            try {
                return [key, JSON.parse(val)]
            }
            catch(e) {
                return [key, val]
            }
        }))

        res.status(200).set({
            "Content-Type": "text/html",
        })
            .end(await renderFrontend(req.originalUrl, context))
    })
}

export function generateLink(context) {
    const urlParams = new URLSearchParams()
    Object.entries(context).forEach(([key, val]) => {
        urlParams.append(
            key,
            typeof val == "object" ? JSON.stringify(val) : val
        )
    })
    return `http://localhost:5000?${urlParams.toString()}`
}