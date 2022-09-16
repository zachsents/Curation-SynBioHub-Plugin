import { Checkbox, Container, Group, useMantineTheme } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import React from 'react'
import FormSection from './FormSection'
import { useRandomColor } from './hooks'
import Sequence from './Sequence'
import SequenceAnnotation from './SequenceAnnotation'

export default function CurationForm({ sequence, annotations }) {

    const [activeAnnotations, setActiveAnnotations] = useSetState({})

    const annotationColors = annotations.map(() => useRandomColor())

    return (
        <Container>
            <Group sx={{ alignItems: "flex-start" }}>
                <FormSection title="Sequence" grow>
                    <Sequence
                        sequence={sequence}
                        subSequences={annotations.map((anno, i) => ({
                            id: anno.pid,
                            start: anno.location[0],
                            end: anno.location[1],
                            color: annotationColors[i],
                            active: activeAnnotations[anno.pid],
                        }))}
                        onChange={(id, val) => setActiveAnnotations({ [id]: val })}
                    />
                </FormSection>
                <FormSection title="Sequence Annotations" w={300}>
                    {annotations.map((anno, i) =>
                        <SequenceAnnotation
                            name={anno.name}
                            color={annotationColors[i]}
                            active={activeAnnotations[anno.pid] ?? false}
                            onChange={val => setActiveAnnotations({ [anno.pid]: val })}
                            key={anno.name}
                        />
                    )}
                </FormSection>
            </Group>
        </Container>
    )
}
