import fetch, { FormData } from "node-fetch"

const BIOBERT_URL = "http://bern2.korea.ac.kr/plain"

export async function runBiobert(text) {

    // send request
    const res = await fetch(BIOBERT_URL, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    })
    const jsonRes = await res.json()

    // group grounded terms together
    const annotations = Object.values(
        jsonRes.annotations.reduce((accum, current) => {
            current.id.forEach(id => {
                accum[id] = {
                    id,
                    idLink: findOntologyLink(id),
                    mentions: [
                        ...(accum[id]?.mentions || []),
                        { 
                            text: current.mention, 
                            confidence: current.prob,
                            start: current.span.begin,
                            end: current.span.end,
                        }
                    ]
                }
            })
            return accum
        }, {})
    )

    return annotations
}

function findOntologyLink(id) {
    const split = id.split(":")
    return OntologyMap[split[0]]?.(split[1])
}

const OntologyMap = {
    NCBITaxon: id => `https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?id=${id}`,
    mesh: id => `https://id.nlm.nih.gov/mesh/${id}.html`,
}