import { ActionIcon, Group, Loader, Select, Text, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { forwardRef, useEffect, useState } from 'react'
import { useUniprot } from '../ontologies/uniprot'
import FormSection from './FormSection'
import { FaTimes } from "react-icons/fa"
import { useStore } from '../store'
import shallow from 'zustand/shallow'


export default function ProteinSelection() {

    // selected proteins states
    const [proteins, addProtein, removeProtein] = useStore(s => [s.proteins, s.addProtein, s.removeProtein], shallow)

    // console.log(proteins)
    

    const handleSelection = selected => {
        setQuery("")
        !proteins.find(prot => prot.id == selected) &&
            addProtein(searchResults.find(result => result.id == selected))
    }
    const handleRemove = id => removeProtein(id)

    // search states
    const searchUniprot = useUniprot()
    const [query, setQuery] = useState("")
    const [debouncedQuery] = useDebouncedValue(query, 800)
    const [searchResults, setSearchResults] = useState([])
    const [searchLoading, setSearchLoading] = useState(false)
    const handleSearchChange = newQuery => {
        newQuery && setSearchLoading(true)
        setQuery(newQuery)
    }

    // search when debounced query changes
    useEffect(() => {
        if (debouncedQuery)
            searchUniprot(debouncedQuery).then(results => {
                setSearchResults(
                    results.slice(0, 20).map(result => ({
                        ...result,
                        label: result.name,
                        value: result.id,
                    }))
                )
                setSearchLoading(false)
            })
        else setSearchLoading(false)
    }, [debouncedQuery])

    return (
        <FormSection title="Proteins">
            {proteins.length ?
                proteins.map(protein => <ProteinItem {...protein} onRemove={() => handleRemove(protein.id)} key={protein.id} />) :
                <Text color="dimmed" px={10}>Search below to add proteins</Text>}
            <Select
                placeholder="Search UniProt..."
                value={null}
                onChange={handleSelection}
                searchable
                onSearchChange={handleSearchChange}
                searchValue={query}
                nothingFound={query ? searchLoading ? "..." : "Nothing found in UniProt" : "Type something to search UniProt"}
                data={searchResults ?? []}
                dropdownPosition="bottom"
                itemComponent={ProtienSearchItem}
                filter={() => true}
                rightSection={searchLoading && <Loader size="xs" mr={10} />}
                styles={selectStyles}
                mt={10}
            />
        </FormSection>
    )
}

const ProteinItem = forwardRef(({ name, organism, id, uri, onRemove }, ref) =>
    <a href={uri} target="_blank">
        <Tooltip label="View in UniProt" withArrow position="bottom">
            <Group noWrap ref={ref} spacing="xs" sx={theme => ({
                padding: "8px 12px",
                margin: 8,
                border: "1px solid " + theme.colors.gray[3],
                borderRadius: 24,
                display: "inline-flex",
                "&:hover": {
                    borderColor: theme.colors.gray[5],
                }
            })}>
                <Text size="sm" color="dark">{name}</Text>
                <Text size="sm" color="dimmed">{organism}</Text>
                <ActionIcon color="red" onClick={event => {
                    event.preventDefault()
                    onRemove()
                }}><FaTimes /></ActionIcon>
            </Group>
        </Tooltip>
    </a>
)

const ProtienSearchItem = forwardRef(({ label, organism, name, ...others }, ref) =>
    <div ref={ref} {...others}>
        <Group noWrap position="apart">
            <Text>{name}</Text>
            <Text color="dimmed">{organism}</Text>
        </Group>
    </div>
)

const selectStyles = theme => ({
    itemsWrapper: {
        width: "calc(100% - 20px)",
    }
})