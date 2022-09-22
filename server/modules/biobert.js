import fetch, { FormData } from "node-fetch"

const BIOBERT_URL = "http://bern2.korea.ac.kr/senddata"

export async function runBiobert(text) {
    
    // construct request
    const formData = new FormData()
    formData.append("draw_keys", "[\"disease\",\"mutation\",\"gene\",\"drug\",\"species\",\"DNA\",\"RNA\",\"cell_line\",\"cell_type\"]")
    formData.append("req_type", "text")
    formData.append("sample_text", text)

    // send request
    const res = await fetch(BIOBERT_URL, {
        method: 'POST',
        body: formData,
    })

    // parse response
    const jsonResponse = JSON.parse(
        (await res.text()).match(/JSON[\S\s]*?<pre[\S\s]*?>([\s\S]+?)<\/pre>/)?.[1]
        || "{}"
    )

    return jsonResponse
}