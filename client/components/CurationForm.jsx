import { Container, Group, Box } from '@mantine/core'
import useSequenceAnnotations from '../hooks/useSequenceAnnotations'
import useTextAnnotations from '../hooks/useTextAnnotations'
import SimilarParts from './SimilarParts'
import RoleSelection from "./RoleSelection"
import ProteinSelection from './ProteinSelection'


export default function CurationForm({ }) {

    const [sequenceComponent, sequenceAnnotationsComponent] = useSequenceAnnotations()
    const [textComponent, textAnnotationsComponent] = useTextAnnotations()

    return (
        <Container mb={300}>
            <Group sx={{ alignItems: "flex-start" }}>
                <Box sx={{ flexGrow: 1, flexBasis: 0, }}>
                    {sequenceComponent}
                    {textComponent}
                    <RoleSelection />
                    <ProteinSelection />
                </Box>
                <Box>
                    <SimilarParts />
                    {sequenceAnnotationsComponent}
                    {textAnnotationsComponent}
                </Box>
            </Group>
        </Container>
    )
}


const exampleSequence = "ACTTTTCATACTCCCGCCAcaggtggcacttttcggggaaatgtgcgcggaacccctatttgtttatttttctaaatacattcaaatatgtatccgctcatgagacaataaccctgataaatgcttcaataatattgaaaaaggaagagtTTCAGAGAAGAAACCAATTGTCCATATTGCATCAGACATTGCCGTCACTGCGTCTTTTACTGGCTCTTCTCGCTAACCAAACCGGTAACCCCGCTTATTAAAAGCATTCTGTAACAAAGCGGGACCAAAGCCATGACAAAAACGCGTAACAAAAGTGTCTATAATCACGGCAGAAAAGTCCACATTGATTATTTGCACGGCGTCACACTTTGCTATGCCATAGCATTTTTATCCATAAGATTAGCGGATCCTACCTGACGCTTTTTATCGCAACTCTCTACTGTTTCTCCATACCCGTTTTTTTGGGCTAGCatgaaaccagtaacgttatacgatgtcgcagagtatgccggtgtctcttatcagaccgtttcccgcgtggtgaaccaggccagccacgtttctgcgaaaacgcgggaaaaagtggaagcggcgatggcggagctgaattacattcccaaccgcgtggcacaacaactggcgggcaaacagtcgttgctgattggcgttgccacctccagtctggccctgcacgcgccgtcgcaaattgtcgcggcgattaaatctcgcgccgatcaactgggtgccagcgtggtggtgtcgatggtagaacgaagcggcgtcgaagcctgtaaagcggcggtgcacaatcttctcgcgcaacgcgtcagtgggctgatcattaactatccgctggatgaccaggatgccattgctgtggaagctgcctgcactaatgttccggcgttatttcttgatgtctctgaccagacacccatcaacagtattattttctcccatgaggacggtacgcgactgggcgtggagcatctggtcgcattgggtcaccagcaaatcgcgctgttagcgggcccattaagttctgtctcggcgcgtctgcgtctggctggctggcataaatatctcactcgcaatcaaattcagccgatagcggaacgggaaggcgactggagtgccatgtccggttttcaacaaaccatgcaaatgctgaatgagggcatcgttcccactgcgatgctggttgccaacgatcagatggcgctgggcgcaatgcgcgccattaccgagtccgggctgcgcgttggtgcggatatctcggtagtgggatacgacgataccgaagatagctcatgttatatcccgccgttaaccaccatcaaacaggattttcgcctgctggggcaaaccagcgtggaccgcttgctgcaactctctcagggccaggcggtgaagggcaatcagctgttgccagtctcactggtgaaaagaaaaaccaccctggcgcccaatacgcaaaccgcctctccccgcgcgttggccgattcattaatgcagctggcacgacaggtttcccgactggaaagcgggcagtgataaCCAATTATTGAACACCCTTCGGGGTGTTTaagaggatgtccaatattttttttaaggaataaggatacttcaagactagattcccccctgcattcccatcagaaccgtaaaccttggcgctttccttgggaagtattcaagaagtgccttgtccggtttctgtggctcacaaaccagcgcgcccgatatggctttcttttcacttatgaatgtaccagtacgggacaattagaacgctcctgtaacaatctctttgcaaatgtggggttacattctaaccatgtcacactgctgacgaaattcaaagtaaaaaaaaatgggaccacgtcttgagaacgatagattttctttattttacattgaacagtcgttgtctcagcgcgctttatgttttcattcatacttcatattataaaataacaaaagaagaatttcatattcacgcccaagaaatcaggctgctttccaaatgcaattgacacttcattagccatcacacaaaactctttcttgctggagcttcttttaaaaaagacctcagtacaccaaacacgttacccgacctcgttattttacgacaactatgataaaattctgaagaaaaaataaaaaaattttcatacttcttgcttttatttaaaccattgaatgatttcttttgaacaaaactacctgtttcaccaaaggaaatagaaagaaaaaatcaattagaagaaaacaaaaaacaaaagatctTTTTGTTTCTGGTCTACC"
const exampleAnnotations = [
    {
        "name": "AmpR terminator",
        "id": "https://synbiohub.org/user/zachsents/curationtest/Test_Part/AmpR_u32_terminator_anno_1",
        "location": [
            20,
            150
        ]
    },
    {
        "name": "pRPL18B",
        "id": "https://synbiohub.org/user/zachsents/curationtest/Test_Part/pRPL18B_anno_1",
        "location": [
            1578,
            2283
        ]
    },
]