import { ActionIcon, Box, Group, Tooltip } from '@mantine/core'
import { useClickOutside, useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'
import { useTextStore } from '../store'
import AnnotationCheckbox from './AnnotationCheckbox'
import TextAnnotationModal from './TextAnnotationModal'
import TextLink from "./TextLink"

export default function TextAnnotationCheckbox({ id, color }) {

    // grab state from store
    const annotation = useTextStore(s => s.annotations.find(anno => anno.id == id))
    const isAnnotationActive = useTextStore(s => s.isAnnotationActive)
    const selectAnnotation = useTextStore(s => s.selectAnnotation)
    const deselectAnnotation = useTextStore(s => s.deselectAnnotation)
    const editAnnotation = useTextStore(s => s.editAnnotation)
    const removeAnnotation = useTextStore(s => s.removeAnnotation)

    // editing state and handlers
    const [editing, editingHandlers] = useDisclosure(false)
    const handleEdit = formValues => {
        editAnnotation(id, formValues)
    }

    // state for confirming deletion
    const [confirmingDelete, setConfirmingDelete] = useState(false)
    const handleDeleteClick = () => {
        confirmingDelete ? removeAnnotation(id) : setConfirmingDelete(true)
    }
    const deleteRef = useClickOutside(() => setConfirmingDelete(false))

    return (
        <>
            <AnnotationCheckbox
                title={annotation.terms[0]}
                subtitle={
                    <Group spacing="xs" position="apart" sx={{ flexGrow: 1, }}>
                        <Tooltip label={annotation.idLink} position="bottom" withArrow>
                            <Box>
                                <TextLink color="gray" href={annotation.idLink}>{id}</TextLink>
                            </Box>
                        </Tooltip>
                        <Group spacing={6}>
                            {annotation.deletable &&
                                <ActionIcon color={confirmingDelete ? "red" : "gray"} onClick={handleDeleteClick} ref={deleteRef}>
                                    <FaTrashAlt />
                                </ActionIcon>}
                            <ActionIcon onClick={editingHandlers.open}>
                                <FaPencilAlt />
                            </ActionIcon>
                        </Group>
                    </Group>
                }
                color={color}
                active={isAnnotationActive(id) ?? false}
                onChange={val => val ? selectAnnotation(id) : deselectAnnotation(id)}
            />
            <TextAnnotationModal opened={editing} onClose={editingHandlers.close} onSubmit={handleEdit} values={annotation} />
        </>
    )
}
