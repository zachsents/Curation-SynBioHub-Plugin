import { ActionIcon, Button, Group, Modal, Text, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler, useClickOutside, useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { FaPencilAlt } from 'react-icons/fa'

export default function EditableText({ children, values = {}, labels = {}, validation, onChange, modalTitle = "Edit Values" }) {

    // editing state and handlers
    const [editing, editingHandlers] = useDisclosure(false)
    const cancelEditing = () => {
        editingHandlers.close()
        form.setValues(values)
    }
    const finishEditing = formValues => {
        editingHandlers.close()
        onChange?.(formValues)
    }

    // form handlers
    const form = useForm({
        initialValues: values,
        validate: validation,
    })

    // make sure values from above and current form values stay synchronized
    useEffect(() => {
        form.setValues(values)
    }, Object.values(values))

    // key handlers
    const keyHandler = getHotkeyHandler([
        // ["enter", finishEditing],
        ["escape", cancelEditing]
    ])

    return (
        <>
            <Group spacing="xs" position="apart" sx={{ flexGrow: 1, }}>
                {children ?? value}
                <ActionIcon onClick={editingHandlers.open}>
                    <FaPencilAlt />
                </ActionIcon>
            </Group>
            <Modal opened={editing} onClose={cancelEditing} title={modalTitle} onKeyDown={keyHandler} closeOnClickOutside={true}>
                <form onSubmit={form.onSubmit(finishEditing)}>

                    {/* make a form field for each value key */}
                    {Object.keys(values).map(key =>
                        <TextInput
                            label={labels?.[key]}
                            {...form.getInputProps(key)}
                            key={key}
                            mb={6}
                        />
                    )}

                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
    )
}