
export const useUniprot = (database = "uniprotkb", mapping) => async query => {
    const response = await (await fetch(`https://rest.uniprot.org/${database}/search?query=${query}`, {
        headers: {
            "Accept": "application/json",
        },
    })).json()

    return mapping ? response.results.map(mapping) : response.results
}