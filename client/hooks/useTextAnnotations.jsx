import { useSetState } from "@mantine/hooks"
import AnnotationCheckbox from "../AnnotationCheckbox"
import FormSection from "../FormSection"
import TextHighlighter from "../TextHighlighter"
import { useCyclicalColors } from "./hooks"


export default function useTextAnnotations(text, textAnnotations) {

    // manage text annotations
    const [active, setActive] = useSetState({})
    const colors = useCyclicalColors(textAnnotations.length)

    return [
        <FormSection title="Description">
            <TextHighlighter
                terms={textAnnotations.map((anno, i) =>
                    anno.mentions.map(mention => ({
                        id: anno.id,
                        start: mention.start,
                        end: mention.end,
                        color: colors[i],
                        active: active[anno.id] ?? false,
                    }))
                ).flat()}
                onChange={(id, val) => setActive({ [id]: val })}
                h={200}
            >
                {text}
            </TextHighlighter>
        </FormSection>,

        <FormSection title="Recognized Terms" w={300}>
            {textAnnotations.map((anno, i) =>
                <AnnotationCheckbox
                    title={anno.mentions[0].text}
                    subtitle={anno.id}
                    subtitleLink={anno.idLink}
                    color={colors[i]}
                    active={active[anno.id] ?? false}
                    onChange={val => setActive({ [anno.id]: val })}
                    key={anno.id}
                />
            )}
        </FormSection>
    ]
}