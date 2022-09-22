import express from "express"
import morgan from "morgan"
import chalk from 'chalk'

import evaluate from "./evaluate.js"
import run from "./run.js"
import status from "./status.js"
import { isProduction } from "./util.js"


const PORT = 5000

// create server and setup middleware
const app = express()
app.use(morgan('tiny'))
app.use(express.json())

// setup vite dev server middleware & endpoints
if (!isProduction()) {
    console.log(chalk.magenta("\nRunning in development mode. Creating dev server."))
    const devServer = await import("./modules/devServer.js")
    devServer.setupServer(app)
}
else
    console.log(chalk.greenBright("\nRunning in production mode."))

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