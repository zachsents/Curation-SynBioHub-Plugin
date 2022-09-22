import { execPromise } from "../util.js"

export async function runSynbict(inputFile, outputFile, featureLibraries) {
    // construct SYNBICT command
    const synbictCommand = "python ./SYNBICT/sequences_to_features/sequences_to_features.py -n http://example.org -m 1000 -M 6 -ni -p " +
        `-t ${inputFile} ` +
        `-o ${outputFile} ` +
        `-f ${featureLibraries.join(" ")} `

    // execute SYNBICT command
    await execPromise(synbictCommand)
}