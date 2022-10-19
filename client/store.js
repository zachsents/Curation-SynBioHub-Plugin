import create from "zustand"
import produce from "immer"

export let useStore = () => ({})

/*
    Standard set of actions for annotations
*/
const annotationActions = (set, get, selector) => {

    const getAnnotation = id => selector(get()).find(anno => anno.id == id)
    const setAnnotationProp = (id, propKey, value) => set(produce(draft => {
        selector(draft).find(anno => anno.id == id)[propKey] = value
    }))

    return {
        editAnnotation: (id, changes) => set(produce(draft => {
            const annoArr = selector(draft)
            const item = annoArr.find(anno => anno.id == id)
            const itemIndex = annoArr.indexOf(item)
            annoArr[itemIndex] = { ...item, ...changes }
        })),
        addAnnotation: newAnno => set(produce(draft => {
            selector(draft).push(newAnno)
        })),
        removeAnnotation: id => set(produce(draft => {
            const annoArr = selector(draft)
            annoArr.splice(annoArr.findIndex(anno => anno.id == id), 1)
        })),
        selectAnnotation: id => setAnnotationProp(id, active, true),
        deselectAnnotation: id => setAnnotationProp(id, active, false),
        getAnnotation,
        isAnnotationActive: id => getAnnotation(id)?.active,
    }
}


/*
    Create store. Need an initialization function for this so context
    gets passed correctly both on server and client.
*/
export default function createStore(context) {

    useStore = create((set, get) => ({
        name: context?.partName,

        description: context?.freeText,
        setDescription: description => set(() => ({ description })),
        textAnnotations: context?.textAnnotations,
        textAnnotationActions: annotationActions(set, get, state => state.textAnnotations),

        sequence: context?.sequence,
        sequenceAnnotations: context?.sequenceAnnotations,
        sequenceAnnotationActions: annotationActions(set, get, state => state.sequenceAnnotations),

        role: null,
        setRole: role => set(() => ({ role })),

        proteins: [],
        addProtein: protein => set(produce(draft => {
            draft.proteins.push(protein)
        })),
        removeProtein: id => set(produce(draft => {
            draft.proteins.splice(draft.proteins.findIndex(prot => prot.id == id), 1)
        })),
    }))
}