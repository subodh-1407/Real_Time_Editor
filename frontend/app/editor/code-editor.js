import { useEffect, useRef } from "react"
import { basicSetup } from "codemirror"
import { indentWithTab } from "@codemirror/commands"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { python } from "@codemirror/lang-python"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { Compartment, Transaction } from "@codemirror/state"
import { EditorView, keymap, placeholder } from "@codemirror/view"
import { tags } from "@lezer/highlight"

export const languages = {
  javascript: { label: "JavaScript", extension: "js", syntax: javascript({ jsx: true }) },
  typescript: { label: "TypeScript", extension: "ts", syntax: javascript({ typescript: true }) },
  python: { label: "Python", extension: "py", syntax: python() },
  json: { label: "JSON", extension: "json", syntax: json() },
  text: { label: "Plain text", extension: "txt" },
}

const editorTheme = EditorView.theme({
  "&": { height: "100%", color: "hsl(var(--foreground))", backgroundColor: "var(--editor-surface)" },
  "&.cm-focused": { outline: "2px solid hsl(var(--ring))", outlineOffset: "-2px" },
  ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-code)", fontSize: "0.875rem", lineHeight: "1.65" },
  ".cm-content": { caretColor: "hsl(var(--primary))", padding: "12px 0" },
  ".cm-placeholder": { color: "hsl(var(--muted-foreground))" },
  ".cm-line": { paddingInline: "12px" },
  ".cm-cursor": { borderLeftColor: "hsl(var(--primary))" },
  ".cm-gutters": {
    color: "hsl(var(--muted-foreground))",
    backgroundColor: "var(--editor-gutter)",
    borderRight: "1px solid hsl(var(--border))",
  },
  ".cm-lineNumbers .cm-gutterElement": { paddingInline: "10px" },
  ".cm-activeLine, .cm-activeLineGutter": { backgroundColor: "var(--editor-active)" },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: "var(--editor-selection)",
  },
  ".cm-tooltip, .cm-panels": {
    color: "hsl(var(--foreground))",
    backgroundColor: "hsl(var(--popover))",
    borderColor: "hsl(var(--border))",
  },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": {
    color: "hsl(var(--primary-foreground))",
    backgroundColor: "hsl(var(--primary))",
  },
}, { dark: true })

const editorHighlighting = syntaxHighlighting(HighlightStyle.define([
  { tag: [tags.keyword, tags.modifier], color: "#ccb6ff" },
  { tag: [tags.string, tags.regexp], color: "#a1edc8" },
  { tag: [tags.number, tags.bool, tags.null], color: "#f6c88f" },
  { tag: [tags.typeName, tags.className, tags.propertyName], color: "#a6d3ff" },
  { tag: tags.function(tags.variableName), color: "#a6d3ff" },
  { tag: tags.comment, color: "#97a5ba" },
  { tag: tags.invalid, color: "var(--danger)" },
]))

export default function CodeEditor({ roomDocument, language, onChange }) {
  const container = useRef(null)
  const editor = useRef(null)
  const languageConfig = useRef(new Compartment())
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const view = new EditorView({
      parent: container.current,
      extensions: [
        basicSetup,
        placeholder("Start typing or paste your code here…"),
        keymap.of([indentWithTab]),
        editorTheme,
        editorHighlighting,
        languageConfig.current.of([]),
        EditorView.contentAttributes.of({ "aria-label": "Shared code", spellcheck: "false" }),
        EditorView.updateListener.of((update) => {
          const localEdit = update.transactions.some(
            (transaction) => transaction.docChanged && !transaction.annotation(Transaction.remote),
          )
          if (localEdit) onChangeRef.current(update.state.doc.toString())
        }),
      ],
    })
    editor.current = view
    return () => {
      view.destroy()
      editor.current = null
    }
  }, [])

  useEffect(() => {
    editor.current.dispatch({ effects: languageConfig.current.reconfigure(languages[language].syntax) })
  }, [language])

  useEffect(() => {
    const view = editor.current
    const current = view.state.doc.toString()
    const next = view.state.toText(roomDocument.code).toString()
    if (current === next) return

    // Keep the unchanged prefix and suffix so remote edits map the local cursor and undo history.
    let from = 0
    let to = current.length
    let nextTo = next.length
    while (from < to && from < nextTo && current[from] === next[from]) from++
    while (to > from && nextTo > from && current[to - 1] === next[nextTo - 1]) {
      to--
      nextTo--
    }

    view.dispatch({
      changes: { from, to, insert: next.slice(from, nextTo) },
      annotations: [Transaction.remote.of(true), Transaction.addToHistory.of(false)],
    })
  }, [roomDocument])

  return <div ref={container} className="h-full" />
}
