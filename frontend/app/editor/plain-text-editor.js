import { useLayoutEffect, useRef } from "react"

export default function PlainTextEditor({ roomDocument, onChange }) {
  const input = useRef(null)

  useLayoutEffect(() => {
    const textarea = input.current
    if (textarea.value === roomDocument.code) return

    const { selectionStart, selectionEnd, selectionDirection, scrollTop } = textarea
    textarea.value = roomDocument.code
    textarea.setSelectionRange(selectionStart, selectionEnd, selectionDirection)
    textarea.scrollTop = scrollTop
  }, [roomDocument])

  return (
    <textarea
      ref={input}
      aria-label="Shared text"
      placeholder="Start typing or paste your text here…"
      className="plain-editor"
      onChange={(event) => onChange(event.target.value)}
    />
  )
}
