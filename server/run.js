import { findNewAnnotations, renderFrontend, runSynbict } from "./util.js"
import fetch from "node-fetch"
import fs from "fs/promises"
import path from "path"
import os from "os"
import chalk from "chalk"

// need this for windows
process.env.ComSpec = "powershell"

export default function run(app) {
    app.post("/run", async (req, res) => {

        // extract valid params from body
        const {
            complete_sbol,  // The single-use URL for the complete SBOL of the object
            shallow_sbol,   // The single-use URL for a truncated SBOL file of the the object
            genbank,        // The single-use URL for the Genbank of the object (Note: This will
            //                      lead to a blank website for all RDF-types other than Component)
            top_level,      // The top-level URL of the SBOL object
            instanceUrl,    // The top-level URL of the SynBioHub instance
            size,           // The number of RDF triples about an object
            type,           // The RDF type of the top-level object
            submit_link,    // the SynBioHub link to which the HTML form should submit
            eval_params,    // A dictionary providing the output values from the evaluate form
        } = req.body

        console.log(chalk.gray("\nReceived run request."))

        // create temp directory
        const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "curation-"))
        const originalFile = path.join(tempDir, "original.xml")
        const annotatedFile = path.join(tempDir, "annotated.xml")

        console.log(chalk.gray("Working in ") + chalk.yellow(tempDir))

        // load SBOL content from one-time URL & write to file for SYNBICT
        const completeSbolContent = await (await fetch(complete_sbol)).text()
        await fs.writeFile(originalFile, completeSbolContent)

        console.log(chalk.gray("Downloaded SBOL file."))
        
        // read in all feature libraries -- SYNBICT says they support
        // directories, but they actually don't; only lists of files
        const featureLibrariesDir = "./feature-libraries"
        const featureLibraries = (await fs.readdir(featureLibrariesDir))
        .map(libraryFileName => path.join(featureLibrariesDir, libraryFileName))
        
        console.log(chalk.gray("Running SYNBICT..."))

        // Run SYNBICT
        try {
            await runSynbict(originalFile, annotatedFile, featureLibraries)
        }
        catch (err) {
            console.error(err)
            res.status(500).send({ message: "Server encountered an error running SYNBICT." })
            return
        }

        console.log(chalk.gray("SYNBICT has completed."))

        // find new annotations
        const annotations = await findNewAnnotations(
            completeSbolContent,
            await fs.readFile(annotatedFile, "utf8")
        )

        console.log(chalk.gray("Created ") + chalk.green(annotations.length) + chalk.gray(" annotations:"))
        console.log(chalk.green(annotations.map(a => a.name).join(", ")))


        res.status(200).send({
            needs_interface: true,
            own_interface: true,
            interface: await renderFrontend(),
            annotations
        })
    })
}