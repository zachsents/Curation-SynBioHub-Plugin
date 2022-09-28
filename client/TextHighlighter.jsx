import { Box, ScrollArea, Text, useMantineTheme } from '@mantine/core'
import React from 'react'
import { getColor } from './util'

export default function TextHighlighter({ children, h, terms, onChange, offsetStart = 0 }) {

    return (
        <ScrollArea styles={scrollAreaStyles(h)} pr={20}>
            <Text sx={mainTextStyle}>{children}</Text>

            {/* Term overlays */}
            {terms.map((term, i) =>
                <Overlay
                    {...term}
                    fullText={children}
                    offsetStart={offsetStart}
                    onChange={val => onChange(term.id, val)}
                    key={term.id + i}
                />
            )}
        </ScrollArea>
    )
}


function Overlay({ fullText, offsetStart, onChange, id, active, color, text, start, end }) {

    // if text is included, then we'll calculate start and end manually
    if (text) {
        // TO DO: calculate start and end manually
    }

    const before = fullText.slice(0, start + offsetStart)
    let during = fullText.slice(start + offsetStart, end)

    const clickHandler = () => {
        onChange(!active)
    }

    return <Box
        sx={overlayContainerStyle(active)}
    >
        <Text sx={overlayBeforeStyle}>{before}</Text>
        <Text sx={overlayDuringStyle(active, color)} onClick={clickHandler}>{during}</Text>
    </Box>

}

const overlayContainerStyle = active => theme => ({
    position: "absolute",
    top: 0,
    zIndex: active ? 6 : 5,
    pointerEvents: "none",
    opacity: active ? 0.8 : 0.5,
    "&:hover": {
        opacity: 0.8,
        zIndex: 7,
    }
})

const generalTextStyle = {
    lineHeight: 1.8,
}

const overlayBeforeStyle = theme => ({
    ...generalTextStyle,
    display: "inline",
    color: "transparent",
})

const overlayDuringStyle = (active, color) => theme => ({
    ...generalTextStyle,
    display: "inline",
    color: "transparent",
    pointerEvents: "all",
    cursor: "pointer",
    marginLeft: -3,
    borderRadius: 5,
    backgroundColor: active ? getColor(theme, color, 3) : "transparent",
    border: "3px solid " + getColor(theme, color, active ? 3 : 2),
})

const mainTextStyle = theme => ({
    ...generalTextStyle,
    zIndex: 10,
    position: "relative",
    pointerEvents: "none",
})

const scrollAreaStyles = (height = 300) => theme => ({
    root: {
        height,
    },
    viewport: {
        position: "relative",
        backgroundColor: "transparent",
        marginTop: 5,
    },
})