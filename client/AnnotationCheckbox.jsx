import { Checkbox, Text, Group } from '@mantine/core'
import TextLink from "./TextLink"

export default function AnnotationCheckbox({ title, subtitle, subtitleLink, active, onChange, color }) {

    const subtitleComponent = subtitle && subtitleLink ?
        <TextLink color="gray" href={subtitleLink}>{subtitle}</TextLink> :
        <Text color="gray">{subtitle}</Text>

    return (
        <Checkbox
            size="md"
            label={<Group spacing="xs">
                <Text color={color} weight={600}>{title}</Text>
                {subtitleComponent}
            </Group>}
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
