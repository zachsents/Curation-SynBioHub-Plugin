import create from "zustand"


export let useSequenceStore = () => ({})
export let useTextStore = () => ({})


/*
    Standard set of actions for annotations
*/
const annotationActions = (set, get) => ({
    editAnnotation: (id, changes) => set(state => {
        const index = state.annotations.findIndex(anno => anno.id == id)    // grab item index so we maintain order
        const newAnnotations = [...state.annotations]                       // clone array
        newAnnotations[index] = {                                           // create new object at old one's index
            ...state.annotations[index],
            ...changes
        }
        return { annotations: newAnnotations }
    }),
    addAnnotation: newAnno => set(state => ({
        annotations: [...state.annotations, newAnno]
    })),
    removeAnnotation: id => set(state => ({
        annotations: state.annotations.filter(anno => anno.id != id)
    })),
    selectAnnotation: id => get().editAnnotation(id, { active: true }),
    deselectAnnotation: id => get().editAnnotation(id, { active: false }),
    getAnnotation: id => get().annotations.find(anno => anno.id == id),
    isAnnotationActive: id => get().getAnnotation(id)?.active
})


/*
    Create store. Need an initialization function for this so context
    gets passed correctly both on server and client.
*/
export default function createStore(context) {

    // Sequence
    useSequenceStore = create((set, get) => ({
        sequence: context?.sequence,
        annotations: context?.sequenceAnnotations,
        ...annotationActions(set, get),
    }))

    // Description / Free Text
    useTextStore = create((set, get) => ({
        description: context?.freeText,
        annotations: context?.textAnnotations,
        setDescription: description => set(() => ({ description })),
        ...annotationActions(set, get),
    }))
}