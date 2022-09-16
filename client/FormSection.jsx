import { Box, Card, Text } from '@mantine/core'
import React from 'react'

export default function FormSection({ title, titleOutside = false, children, grow, w }) {

    const titleComponent = <Text size="lg" weight={600}>{title}</Text>

    return (
        <Box sx={{ width: w ?? "auto", flexGrow: grow ? 1 : 0, flexBasis: grow ? 0 : "auto" }}>
            {titleOutside && titleComponent}
            <Card p="sm" radius="md" withBorder={true}>
                {!titleOutside && <Card.Section withBorder inheritPadding py="sm" mb={10}>
                    {titleComponent}
                </Card.Section>}
                {children}
            </Card>
        </Box>
    )
}
