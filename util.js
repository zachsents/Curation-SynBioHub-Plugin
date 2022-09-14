import { exec } from "child_process"
import fs from "fs/promises"
import { Graph, SBOL2GraphView } from "sbolgraph"

export async function injectGlobalsInHtml(htmlFile, objectToInject) {
    const htmlContent = await fs.readFile("./run-form/dist/index.html", "utf-8")

    return htmlContent.replace("</title>", `$&
    <script>
        window.curationPlugin = ${JSON.stringify(objectToInject)}
    </script>`)
}

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

export async function runSynbict(inputFile, outputFile, featureLibraries) {
    // construct SYNBICT command
    const synbictCommand = "python ./SYNBICT/sequences_to_features/sequences_to_features.py -n http://example.org -m 1000 -M 6 -ni -p " +
        `-t ${inputFile} ` +
        `-o ${outputFile} ` +
        `-f ${featureLibraries.join(" ")} `

    // execute SYNBICT command
    await execPromise(synbictCommand)
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