
export const useUniprot = () => async query => {
    const res = await (await fetch(`https://rest.uniprot.org/uniprotkb/search?query=${query}`, {
        headers: {
            "Accept": "application/json",
        },
    })).json()

    return res.results.map(result => ({
        id: result.uniProtkbId,
        name: result.proteinDescription?.recommendedName?.fullName?.value,
        organism: result.organism?.scientificName,
        uri: `https://www.uniprot.org/entry/${result.uniProtkbId}`,
    }))
}