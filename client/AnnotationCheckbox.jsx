import { Checkbox } from '@mantine/core'

export default function AnnotationCheckbox({ name, active, onChange, color }) {

    return (
        <Checkbox
            size="md"
            label={name}
            color={color}
            checked={active}
            onChange={event => onChange(event.currentTarget.checked)}
            mb={10}
            styles={theme => ({
                input: { backgroundColor: theme.colors[color]?.[1] ?? "transparent" }
            })}
        />
    )
}
