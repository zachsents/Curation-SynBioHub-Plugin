import { ActionIcon, Group, Text, Tooltip } from '@mantine/core'
import { forwardRef } from 'react'
import { useUniprot } from '../ontologies/uniprot'
import FormSection from './FormSection'
import { FaTimes } from "react-icons/fa"
import { useStore } from '../store'
import shallow from 'zustand/shallow'
import MultiRowSelect from './MultiRowSelect'


export default function TargetOrganismsSelection() {

    const {
        items: organisms,
        add: addOrganism,
        remove: removeOrganism
    } = useStore(s => s.targetOrganisms, shallow)
    
    const searchUniprot = useUniprot("taxonomy", result => ({
        id: result.taxonId,
        name: result.scientificName,
        commonName: result.commonName ?? "",
        uri: `https://www.uniprot.org/taxonomy/${result.taxonId}`,
    }))

    return (
        <FormSection title="Target Organisms">
            <MultiRowSelect
                items={organisms}
                addItem={addOrganism}
                removeItem={removeOrganism}
                search={searchUniprot}
                itemComponent={OrganismItem}
                searchItemComponent={OrganismSearchItem}
                messages={{ initial: "Type something to search", nothingFound: "Nothing found in Taxonomy" }}
                pluralLabel="organisms"
                debounce={800}
                placeholder="Search Taxonomy..."
            />
        </FormSection>
    )
}

const OrganismItem = forwardRef(({ id, name, commonName, uri, onRemove }, ref) =>
    <a href={uri} target="_blank">
        <Tooltip label="View in Taxonomy" withArrow position="bottom">
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
                <Text size="sm" color="dimmed">{commonName}</Text>
                <ActionIcon color="red" onClick={event => {
                    event.preventDefault()
                    onRemove()
                }}><FaTimes /></ActionIcon>
            </Group>
        </Tooltip>
    </a>
)

const OrganismSearchItem = forwardRef(({ label, name, commonName, ...others }, ref) =>
    <div ref={ref} {...others}>
        <Group noWrap position="apart">
            <Text>{name}</Text>
            <Text color="dimmed">{commonName}</Text>
        </Group>
    </div>
)

