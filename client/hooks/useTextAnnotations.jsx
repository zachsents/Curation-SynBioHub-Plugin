import { useSetState } from "@mantine/hooks"
import AnnotationCheckbox from "../components/AnnotationCheckbox"
import FormSection from "../components/FormSection"
import TextHighlighter from "../components/TextHighlighter"
import { useTextStore } from "../store"
import { useCyclicalColors } from "./hooks"


export default function useTextAnnotations() {

    const { description, annotations, isAnnotationActive, selectAnnotation, deselectAnnotation, editAnnotation } = useTextStore()

    // create a set of contrasty colors
    const colors = useCyclicalColors(annotations.length)

    return [
        <FormSection title="Description">
            <TextHighlighter
                terms={annotations.map((anno, i) =>
                    anno.mentions.map(mention => ({
                        id: anno.id,
                        start: mention.start,
                        end: mention.end,
                        color: colors[i],
                        active: isAnnotationActive(anno.id) ?? false,
                    }))
                ).flat()}
                onChange={(id, val) => val ? selectAnnotation(id) : deselectAnnotation(id)}
                h={200}
            >
                {description}
            </TextHighlighter>
        </FormSection>,

        <FormSection title="Recognized Terms" w={350}>
            {annotations.map((anno, i) =>
                <AnnotationCheckbox
                    title={anno.mentions[0].text}
                    identifier={anno.id}
                    identifierUri={anno.idLink}
                    editable={true}
                    onEdit={newValues => editAnnotation(anno.id, newValues)}
                    color={colors[i]}
                    active={isAnnotationActive(anno.id) ?? false}
                    onChange={val => val ? selectAnnotation(anno.id) : deselectAnnotation(anno.id)}
                    key={anno.id}
                />
            )}
        </FormSection>
    ]
}