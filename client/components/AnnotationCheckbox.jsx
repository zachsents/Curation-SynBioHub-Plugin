import { Checkbox, Text, Group, Tooltip, Box } from '@mantine/core'
import { useEffect } from 'react'
import { useState } from 'react'
import EditableText from './EditableText'
import TextLink from "./TextLink"

export default function AnnotationCheckbox({ title, identifier, identifierUri, editable, onEdit, active, onChange, color }) {

    // create component for identifier; could be a link with a tooltip or just text
    const identifierComponent = identifier && identifierUri ?
        <Tooltip
            label={identifierUri}
            position="bottom"
            withArrow
        >
            <Box><TextLink color="gray" href={identifierUri}>{identifier}</TextLink></Box>

        </Tooltip> :
        <Text color="gray">{identifier}</Text>

    return (
        <Checkbox
            size="md"
            label={
                <Group spacing="xs">
                    <Text color={color} weight={600}>{title}</Text>
                    {editable ?
                        <EditableText
                            values={{ id: identifier, idLink: identifierUri }}
                            labels={{ id: "Identifier", idLink: "URI" }}
                            onChange={editedValues => onEdit?.(editedValues)}
                            modalTitle="Edit Annotation"
                        >
                            {identifierComponent}
                        </EditableText> :
                        identifierComponent}
                </Group>
            }
            color={color}
            checked={active}
            onChange={event => onChange(event.currentTarget.checked)}
            mb={10}
            styles={theme => ({
                input: { backgroundColor: theme.colors[color]?.[1] ?? "transparent" },
                label: { flexGrow: 1 },
            })}
        />
    )
}