import express from "express"
import morgan from "morgan"
import chalk from 'chalk'

import evaluate from "./evaluate.js"
import run from "./run.js"
import status from "./status.js"


const PORT = 5000

const app = express()
app.use(morgan('tiny'))
app.use(express.json())

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