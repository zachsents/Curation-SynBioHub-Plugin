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

    return await res.json()
}