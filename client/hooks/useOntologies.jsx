import { useDebouncedValue } from "@mantine/hooks"
import { useEffect } from "react"
import lunr from "lunr"

class SearchIndex extends Promise {

    constructor(indexCreator, fromConstructor) {
        let resolve
        super((res, rej) => {
            resolve = res
            if (!fromConstructor)
                return indexCreator(res, rej)   // required for subclassing Promise (.then needs this)
        })
        this.resolve = resolve
        this.startedIndexing = false
        this.indexCreator = indexCreator
    }

    index() {
        this.startedIndexing = true
        this.indexCreator(this.resolve)
    }

    async search(query) {
        return (await this)(query)
    }

    use() {
        useEffect(() => {
            if (!this.startedIndexing)
                this.index()
        }, [])
        return this.search.bind(this)
    }
}

/*
    Index Sequence Ontology for searching
*/
const soIndex = new SearchIndex(resolve => {
    fetch("/so.json")
        .then(res => res.json())
        .then(so => {
            const documents = {}
            const index = lunr(function () {
                this.field("id", { boost: 3 })
                this.field("name", { boost: 5 })
                this.field("description")
                this.field("synonyms")

                so.graphs[0].nodes.forEach(node => {
                    const id = "SO:" + node.id.match(/[^_]+$/)?.[0]
                    const newDoc = {
                        id,
                        name: node.lbl,
                        description: node.meta?.definition?.val,
                        synonyms: node.meta?.synonyms?.map(syn => syn.val).join(", ") ?? "",
                    }
                    this.add(newDoc)
                    documents[id] = newDoc
                })
            })
            // resolve search function
            resolve(query =>
                index.search(query).map(result => ({
                    ...result,
                    document: documents[result.ref]
                }))
            )
        })
}, true)

export const useSequenceOntology = soIndex.use.bind(soIndex)


export function useOntologies(query) {
    const [debouncedQuery] = useDebouncedValue(query, 500)

    useEffect(() => {
        // searchAddgene(debouncedQuery)
    }, [debouncedQuery])
}

async function searchAddgene(query) {

    // Not working because of CORS. Will have to find another solution

    if (!query)
        return []

    const res = await (await fetch(`https://www.addgene.org/search/catalog/plasmids/?q=${query}`)).text()

    console.log(res.matchAll(/search-result-title[\s\S]*?<a.*?(\d+).*?>(.*?)</g))
}


