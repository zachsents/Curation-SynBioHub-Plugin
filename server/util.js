import chalk from "chalk"
import { exec } from "child_process"
import fs from "fs/promises"
import { Graph, SBOL2GraphView } from "sbolgraph"


export function execPromise(command, options) {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr })
                return
            }
            resolve(stdout)
        })
    })
}


export async function findNewAnnotations(originalContent, annotatedContent) {
    // create and load original doc
    const originalDoc = new SBOL2GraphView(new Graph())
    await originalDoc.loadString(originalContent)

    // create and load annotated doc
    const annDoc = new SBOL2GraphView(new Graph())
    await annDoc.loadString(annotatedContent)

    // make a list of persistentIds to avoid
    const originalAnnotations = originalDoc.rootComponentDefinitions[0].sequenceAnnotations
        .map(sa => sa.persistentIdentity)

    // make a list of new annotations
    return annDoc.rootComponentDefinitions[0].sequenceAnnotations
        // filter annotations already in original document
        .filter(sa => !originalAnnotations.includes(sa.persistentIdentity))
        // just return the info we need
        .map(sa => ({
            name: sa.displayName,
            pid: sa.persistentIdentity,
            location: [sa.rangeMin, sa.rangeMax]
        }))
}


export async function pullFreeText(sbolContent) {
    // create and load original doc
    const doc = new SBOL2GraphView(new Graph())
    await doc.loadString(sbolContent)

    // grab free text elements and flatten them into an array
    return doc.rootComponentDefinitions
        .map(cd => [cd.description])
        .flat()
}

export async function getSequence(sbolContent) {
    // create and load original doc
    const doc = new SBOL2GraphView(new Graph())
    await doc.loadString(sbolContent)

    return doc.rootComponentDefinitions[0]?.sequences[0]?.elements
}

function fillTemplate(template, renderedOutput, context) {
    return template.replace("<!--ssr-outlet-->", renderedOutput)
        + `<script>window.__CONTEXT__ = ${JSON.stringify(context)}</script>`
}

export async function renderFrontend(url, context = {}) {

    // PRODUCTION
    // run from built files
    if (isProduction()) {
        const template = await fs.readFile("./dist/client/client/index.html", "utf8")
        const { render } = await import("../dist/server/ssrEntry.js")
        return fillTemplate(template, await render(url, context), context)
    }

    // DEVELOPMENT
    // run from dev server
    const { viteDevServer } = await import("./modules/devServer.js")
    const template = await viteDevServer.transformIndexHtml(
        url,
        await fs.readFile("./client/index.html", "utf8")
    )
    const { render } = await viteDevServer.ssrLoadModule("./server/ssrEntry.jsx")
    return fillTemplate(template, await render(url, context), context)
}

export function isProduction() {
    return process.env.NODE_ENV === 'production'
}

export function throwError(res, error, message) {
    console.log(chalk.red(message))
    res.status(500).send({ message, fullError: { message: error.message, ...error } })
}