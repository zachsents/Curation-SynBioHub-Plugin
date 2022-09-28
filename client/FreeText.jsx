import { Highlight } from '@mantine/core'
import React from 'react'
import { useCallback } from 'react'
import { getColor } from './util'

export default function FreeText({ children, terms, onChange }) {

    const highlightContainerStyle = useCallback(theme => Object.fromEntries(
        terms.map((term, i) => [
            `& mark:nth-of-type(${i + 1})`,
            {
                backgroundColor: term.active ? getColor(theme, term.color, 3) : "transparent",
                border: "3px solid " + getColor(theme, term.color, term.active ? 3 : 2),
                borderRadius: 5,
                "&:hover": {
                    backgroundColor: getColor(theme, term.color, term.active ? 3 : 2),
                },
            }
        ])
    ), [JSON.stringify(terms)])

    const clickHandler = event => {
        const marks = [...event.target.parentNode.children].filter(el => el.tagName == "MARK")
        const term = terms[marks.indexOf(event.target)]
        term && onChange(term.text, !term.active)
    }

    return (
        <Highlight
            highlight={terms.map(t => t.text)}
            highlightStyles={highlightStyles}
            sx={highlightContainerStyle}
            onClick={clickHandler}
        >
            {children}
        </Highlight>
    )
}

const highlightStyles = theme => ({
    cursor: "pointer",
})