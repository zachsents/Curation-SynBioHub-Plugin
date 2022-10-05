import AddTextAnnotation from "../components/AddTextAnnotation"
import AnnotationCheckbox from "../components/AnnotationCheckbox"
import FormSection from "../components/FormSection"
import TextAnnotationCheckbox from "../components/TextAnnotationCheckbox"
import TextHighlighter from "../components/TextHighlighter"
import { useTextStore } from "../store"
import { useCyclicalColors } from "./hooks"


export default function useTextAnnotations() {

    const {
        description,
        annotations,
        isAnnotationActive,
        selectAnnotation,
        deselectAnnotation,
        editAnnotation,
    } = useTextStore()

    // create a set of contrasty colors
    const colors = useCyclicalColors(annotations.length)

    return [
        <FormSection title="Description">
            <TextHighlighter
                terms={annotations.map((anno, i) =>
                    anno.terms.map(termText => {
                        const foundMentions = []
                        const reg = new RegExp(termText, "gi")
                        let occurence
                        while (occurence = reg.exec(description)) {
                            foundMentions.push({
                                id: anno.id,
                                color: colors[i],
                                active: isAnnotationActive(anno.id) ?? false,
                                start: occurence.index,
                                end: occurence.index + termText.length,
                            })
                        }
                        return foundMentions
                    }).flat()
                ).flat()}
                onChange={(id, val) => val ? selectAnnotation(id) : deselectAnnotation(id)}
                h={200}
            >
                {description}
            </TextHighlighter>
        </FormSection>,

        <FormSection title="Recognized Terms" w={350}>
            {annotations.map((anno, i) =>
                <TextAnnotationCheckbox id={anno.id} color={colors[i]} key={anno.id} />
            )}

            <AddTextAnnotation />
        </FormSection>
    ]
}