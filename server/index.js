import express from "express"
import morgan from "morgan"
import chalk from 'chalk'
import fs from "fs/promises"

import evaluate from "./evaluate.js"
import run from "./run.js"
import status from "./status.js"


const PORT = 5000
const production = process.env.NODE_ENV === 'production'

// create server and setup middleware
const app = express()
app.use(morgan('tiny'))
app.use(express.json())

// setup vite dev server middleware
if (!production) {
    const vite = await import("vite")
    const viteDevServer = await vite.createServer({
        server: { middlewareMode: true },
        appType: 'custom'
    })

    app.use(viteDevServer.middlewares)

    app.get("/", async (req, res) => {
        const url = req.originalUrl
        const template = await viteDevServer.transformIndexHtml(
            url,
            await fs.readFile("./client/index.html", "utf8")
        )
        const { render } = await viteDevServer.ssrLoadModule("./server/ssrEntry.jsx")

        const renderedHtml = template.replace("<!--ssr-outlet-->", await render(url))
        res.status(200).set({
            "Content-Type": "text/html",
        })
            .end(renderedHtml)
    })
}

// serve static files for frontend
app.use(express.static("dist/client"))

// GET  /status
status(app)
// POST /evaluate
evaluate(app)
// POST /run
run(app)

app.listen(PORT, () => {
    console.log(
        chalk.bgWhite.blue(`\nExpress listening on port ${PORT}\n`)
    )
})