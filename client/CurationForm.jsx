import { Container, Group, Box } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import React from 'react'
import { useAppContext } from './context'
import FormSection from './FormSection'
import { useCyclicalColors, useRandomColor } from './hooks'
import Sequence from './Sequence'
import AnnotationCheckbox from './AnnotationCheckbox'
import FreeText from "./FreeText"
import TextHighlighter from './TextHighlighter'

export default function CurationForm({ }) {

    // info from SSR context
    const {
        sequence,
        sequenceAnnotations,
        freeText,
        textAnnotations,
    } = useAppContext()

    // manage sequence annotations
    const [activeSequenceAnnotations, setActiveSequenceAnnotations] = useSetState({})
    const sequenceAnnotationColors = useCyclicalColors(sequenceAnnotations.length)

    // manage text annotations
    const [activeTextAnnotations, setActiveTextAnnotations] = useSetState({})
    const textAnnotationColors = useCyclicalColors(textAnnotations.length)

    return (
        <Container>
            <Group sx={{ alignItems: "flex-start" }}>
                <Box sx={{ flexGrow: 1, flexBasis: 0, }}>
                    <FormSection title="Sequence">
                        <Sequence
                            sequence={sequence}
                            subSequences={sequenceAnnotations.map((anno, i) => ({
                                id: anno.pid,
                                start: anno.location[0],
                                end: anno.location[1],
                                color: sequenceAnnotationColors[i],
                                active: activeSequenceAnnotations[anno.pid] ?? false,
                            }))}
                            onChange={(id, val) => setActiveSequenceAnnotations({ [id]: val })}
                        />
                    </FormSection>
                    <FormSection title="Description">
                        <TextHighlighter
                            terms={textAnnotations.map((anno, i) =>
                                anno.mentions.map(mention => ({
                                    id: anno.id,
                                    // text: mention.text,
                                    start: mention.start,
                                    end: mention.end,
                                    color: textAnnotationColors[i],
                                    active: activeTextAnnotations[anno.id] ?? false,
                                }))
                            ).flat()}
                            onChange={(id, val) => setActiveTextAnnotations({ [id]: val })}
                            h={200}
                        >
                            {freeText}
                        </TextHighlighter>
                    </FormSection>
                </Box>
                <Box>
                    <FormSection title="Sequence Annotations" w={300}>
                        {sequenceAnnotations.map((anno, i) =>
                            <AnnotationCheckbox
                                title={anno.name}
                                color={sequenceAnnotationColors[i]}
                                active={activeSequenceAnnotations[anno.pid] ?? false}
                                onChange={val => setActiveSequenceAnnotations({ [anno.pid]: val })}
                                key={anno.name}
                            />
                        )}
                    </FormSection>
                    <FormSection title="Recognized Terms" w={300}>
                        {textAnnotations.map((anno, i) =>
                            <AnnotationCheckbox
                                title={anno.mentions[0].text}
                                subtitle={anno.id}
                                subtitleLink={anno.idLink}
                                color={textAnnotationColors[i]}
                                active={activeTextAnnotations[anno.id] ?? false}
                                onChange={val => setActiveTextAnnotations({ [anno.id]: val })}
                                key={anno.id}
                            />
                        )}
                    </FormSection>
                </Box>
            </Group>
        </Container>
    )
}


const exampleSequence = "ACTTTTCATACTCCCGCCAcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtTTCAGAGAAGAAACCAATTGTCCATATTGCATCAGACATTGCCGTCACTGCGTCTTTTACTGGCTCTTCTCGCTAACCAAACCGGTAACCCCGCTTATTAAAAGCATTCTGTAACAAAGCGGGACCAAAGCCATGACAAAAACGCGTAACAAAAGTGTCTATAATCACGGCAGAAAAGTCCACATTGATTATTTGCACGGCGTCACACTTTGCTATGCCATAGCATTTTTATCCATAAGATTAGCGGATCCTACCTGACGCTTTTTATCGCAACTCTCTACTGTTTCTCCATACCCGTTTTTTTGGGCTAGCatgaaaccagtaacgttatacgatgtcgcagagtatgccggtgtctcttatcagaccgtttcccgcgtggtgaaccaggccagccacgtttctgcgaaaacgcgggaaaaagtggaagcggcgatggcggagctgaattacattcccaaccgcgtggcacaacaactggcgggcaaacagtcgttgctgattggcgttgccacctccagtctggccctgcacgcgccgtcgcaaattgtcgcggcgattaaatctcgcgccgatcaactgggtgccagcgtggtggtgtcgatggtagaacgaagcggcgtcgaagcctgtaaagcggcggtgcacaatcttctcgcgcaacgcgtcagtgggctgatcattaactatccgctggatgaccaggatgccattgctgtggaagctgcctgcactaatgttccggcgttatttcttgatgtctctgaccagacacccatcaacagtattattttctcccatgaggacggtacgcgactgggcgtggagcatctggtcgcattgggtcaccagcaaatcgcgctgttagcgggcccattaagttctgtctcggcgcgtctgcgtctggctggctggcataaatatctcactcgcaatcaaattcagccgatagcggaacgggaaggcgactggagtgccatgtccggttttcaacaaaccatgcaaatgctgaatgagggcatcgttcccactgcgatgctggttgccaacgatcagatggcgctgggcgcaatgcgcgccattaccgagtccgggctgcgcgttggtgcggatatctcggtagtgggatacgacgataccgaagatagctcatgttatatcccgccgttaaccaccatcaaacaggattttcgcctgctggggcaaaccagcgtggaccgcttgctgcaactctctcagggccaggcggtgaagggcaatcagctgttgccagtctcactggtgaaaagaaaaaccaccctggcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgataaCCAATTATTGAACACCCTTCGGGGTGTTTaagaggatgtccaatattttttttaaggaataaggatacttcaagactagattcccccctgcattcccatcagaaccgtaaaccttggcgctttccttgggaagtattcaagaagtgccttgtccggtttctgtggctcacaaaccagcgcgcccgatatggctttcttttcacttatgaatgtaccagtacgggacaattagaacgctcctgtaacaatctctttgcaaatgtggggttacattctaaccatgtcacactgctgacgaaattcaaagtaaaaaaaaatgggaccacgtcttgagaacgatagattttctttattttacattgaacagtcgttgtctcagcgcgctttatgttttcattcatacttcatattataaaataacaaaagaagaatttcatattcacgcccaagaaatcaggctgctttccaaatgcaattgacacttcattagccatcacacaaaactctttcttgctggagcttcttttaaaaaagacctcagtacaccaaacacgttacccgacctcgttattttacgacaactatgataaaattctgaagaaaaaataaaaaaattttcatacttcttgcttttatttaaaccattgaatgatttcttttgaacaaaactacctgtttcaccaaaggaaatagaaagaaaaaatcaattagaagaaaacaaaaaacaaaagatctTTTTGTTTCTGGTCTACC"
const exampleAnnotations = [
    {
        "name": "AmpR terminator",
        "pid": "https://synbiohub.org/user/zachsents/curationtest/Test_Part/AmpR_u32_terminator_anno_1",
        "location": [
            20,
            150
        ]
    },
    {
        "name": "pRPL18B",
        "pid": "https://synbiohub.org/user/zachsents/curationtest/Test_Part/pRPL18B_anno_1",
        "location": [
            1578,
            2283
        ]
    },
]