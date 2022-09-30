import { useSetState } from "@mantine/hooks"
import AnnotationCheckbox from "../AnnotationCheckbox"
import FormSection from "../FormSection"
import TextHighlighter from "../TextHighlighter"
import { useCyclicalColors } from "./hooks"

export default function useSequenceAnnotations(sequence, sequenceAnnotations) {

    // manage sequence annotations
    const [active, setActive] = useSetState({})
    const colors = useCyclicalColors(sequenceAnnotations.length)

    return [
        <FormSection title="Sequence">
            <TextHighlighter
                terms={sequenceAnnotations.map((anno, i) => ({
                    id: anno.pid,
                    start: anno.location[0],
                    end: anno.location[1],
                    color: colors[i],
                    active: active[anno.pid] ?? false,
                }))}
                onChange={(id, val) => setActive({ [id]: val })}
                h={500}
                offsetStart={-1}
                wordMode={8}
                textStyle={{
                    fontFamily: "monospace",
                    fontSize: 16,
                    letterSpacing: 0.2,
                }}
            >
                {sequence.toLowerCase()}
            </TextHighlighter>
        </FormSection>,

        <FormSection title="Sequence Annotations" w={300}>
            {sequenceAnnotations.map((anno, i) =>
                <AnnotationCheckbox
                    title={anno.name}
                    color={colors[i]}
                    active={active[anno.pid] ?? false}
                    onChange={val => setActive({ [anno.pid]: val })}
                    key={anno.name}
                />
            )}
        </FormSection>
    ]
}