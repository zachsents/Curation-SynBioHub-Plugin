import { Container, Group, Box } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import React from 'react'
import { useAppContext } from './context'
import FormSection from './FormSection'
import { useRandomColor } from './hooks'
import Sequence from './Sequence'
import AnnotationCheckbox from './AnnotationCheckbox'
import FreeText from "./FreeText"

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
    const sequenceAnnotationColors = sequenceAnnotations.map(() => useRandomColor())

    // manage text annotations
    const [activeTextAnnotations, setActiveTextAnnotations] = useSetState({})
    const textAnnotationColors = textAnnotations.map(() => useRandomColor())

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
                        <FreeText
                            terms={textAnnotations.map((anno, i) => ({
                                text: anno.mention,
                                color: textAnnotationColors[i],
                                active: activeTextAnnotations[anno.mention] ?? false,
                            }))}
                            onChange={(id, val) => setActiveTextAnnotations({ [id]: val })}
                        >
                            {freeText}
                        </FreeText>
                    </FormSection>
                </Box>
                <Box>
                    <FormSection title="Sequence Annotations" w={300}>
                        {sequenceAnnotations.map((anno, i) =>
                            <AnnotationCheckbox
                                name={anno.name}
                                color={sequenceAnnotationColors[i]}
                                active={activeSequenceAnnotations[anno.pid] ?? false}
                                onChange={val => setActiveSequenceAnnotations({ [anno.pid]: val })}
                                key={anno.name}
                            />
                        )}
                    </FormSection>
                    <FormSection title="Suggested Keywords" w={300}>
                        {textAnnotations.map((anno, i) =>
                            <AnnotationCheckbox
                                name={anno.mention}
                                color={textAnnotationColors[i]}
                                active={activeTextAnnotations[anno.mention] ?? false}
                                onChange={val => setActiveTextAnnotations({ [anno.mention]: val })}
                                key={anno.mention}
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