'use client'

import { useEffect, useRef, useState } from 'react'
import { mathFit } from '@/lib/math-layout'

interface ExpandedFormula {
  display: HTMLElement
  width: number
  fontSize: number
}

function dimensions(formula: HTMLElement) {
  const html = formula.querySelector<HTMLElement>('.katex-html')
  if (!html) return null
  const parts = Array.from(html.children)
    .filter((child) => !child.matches('.katex-tag, .tag'))
    .map((child) => child.getBoundingClientRect())
    .filter((rect) => rect.width > 0)
  const expression = parts.length
    ? Math.max(...parts.map((rect) => rect.right)) - Math.min(...parts.map((rect) => rect.left))
    : 0
  const tag = Math.max(
    0,
    ...Array.from(html.querySelectorAll('.katex-tag, .tag')).map(
      (child) => child.getBoundingClientRect().width,
    ),
  )
  return { expression, tag }
}

export function FitMath({ postSlug }: { postSlug: string }) {
  const [expanded, setExpanded] = useState<ExpandedFormula | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      `[data-post-letter][data-post-slug="${CSS.escape(postSlug)}"] [data-post-body]`,
    )
    if (!root) return
    const formulas = Array.from(root.querySelectorAll<HTMLElement>('.katex-display')).flatMap(
      (display, index) => {
        const formula = display.querySelector<HTMLElement>('.katex')
        if (!formula) return []
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'post-math-expand post-screen-only'
        button.textContent = 'Expand'
        button.setAttribute('aria-label', `Expand formula ${index + 1}`)
        button.hidden = true
        display.append(button)
        const entry = {
          display,
          formula,
          button,
          originalSize: formula.style.fontSize,
          width: 0,
          fontSize: 0,
        }
        button.addEventListener('click', () =>
          setExpanded({ display, width: entry.width, fontSize: entry.fontSize }),
        )
        return [entry]
      },
    )
    if (!formulas.length) return
    let disposed = false
    let frame = 0
    let lastWidth = -1
    const print = window.matchMedia('print')

    const fit = (printing = print.matches) => {
      if (disposed) return
      frame = 0
      for (const entry of formulas) {
        const { display, formula, button } = entry
        display.dataset.mathFitted = 'true'
        formula.style.fontSize = entry.originalSize
        const size = parseFloat(getComputedStyle(formula).fontSize)
        const measurement = dimensions(formula)
        // A4's 178mm content width also fits portrait Letter. Selected printer
        // dimensions are not exposed to JS; never use the screen width in print.
        // KaTeX's table struts extend 2px beyond their own box; keep a real
        // inset on each side rather than clipping that overflow.
        const available = (printing ? (178 * 96) / 25.4 : display.clientWidth) - 4
        if (!measurement || available <= 0) continue
        const initial = mathFit(available, measurement.expression, measurement.tag, size)
        let scale = initial.scale
        formula.style.fontSize = `${size * scale}px`
        // Check the actual rendered result too, allowing for font/SVG rounding.
        for (let pass = 0; pass < 2; pass++) {
          const actual = dimensions(formula)
          if (!actual) break
          const correction = mathFit(available, actual.expression, actual.tag, size * scale)
          if (correction.scale >= 1) break
          scale *= correction.scale
          formula.style.fontSize = `${size * scale}px`
        }
        // Layout boxes can omit glyph/strut overhang. Check real scrollable
        // bounds on screen, preserving the separate paper-width print target.
        if (!printing) {
          for (let pass = 0; pass < 4; pass++) {
            const overflow = display.scrollWidth - display.clientWidth
            if (overflow <= 0) break
            const correction = mathFit(available, available + overflow * 2)
            scale *= correction.scale
            formula.style.fontSize = `${size * scale}px`
          }
        }
        entry.width = initial.width
        entry.fontSize = size
        button.hidden = printing || scale >= 0.8
      }
    }
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(() => fit())
    }
    const beforePrint = () => fit(true)
    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width
            if (width !== undefined && width !== lastWidth) {
              lastWidth = width
              schedule()
            }
          })
    observer?.observe(root)
    if (!observer) window.addEventListener('resize', schedule)
    print.addEventListener('change', schedule)
    window.addEventListener('beforeprint', beforePrint)
    window.addEventListener('afterprint', schedule)
    void document.fonts.ready.then(schedule)
    schedule()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      window.removeEventListener('resize', schedule)
      print.removeEventListener('change', schedule)
      window.removeEventListener('beforeprint', beforePrint)
      window.removeEventListener('afterprint', schedule)
      for (const entry of formulas) {
        entry.formula.style.fontSize = entry.originalSize
        delete entry.display.dataset.mathFitted
        entry.button.remove()
      }
    }
  }, [postSlug])

  useEffect(() => {
    const modal = dialog.current
    const container = content.current
    if (!expanded || !modal || !container) return
    const clone = expanded.display.cloneNode(true) as HTMLElement
    clone.querySelectorAll('.post-math-expand').forEach((button) => button.remove())
    clone.removeAttribute('data-math-fitted')
    clone.removeAttribute('id')
    clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'))
    const formula = clone.querySelector<HTMLElement>('.katex')
    if (formula) formula.style.fontSize = `${expanded.fontSize}px`
    clone.style.width = `${Math.ceil(expanded.width) + 2}px`
    container.replaceChildren(clone)
    modal.showModal()
    return () => {
      if (modal.open) modal.close()
      container.replaceChildren()
    }
  }, [expanded])

  return (
    <dialog
      ref={dialog}
      className="post-equation-dialog post-screen-only"
      aria-label="Expanded formula"
      onClose={() => setExpanded(null)}
    >
      <div className="post-equation-dialog-toolbar">
        <p>Full-size formula</p>
        <button type="button" onClick={() => dialog.current?.close()}>
          Close
        </button>
      </div>
      <div
        ref={content}
        className="post-equation-dialog-content"
        tabIndex={0}
        role="region"
        aria-label="Scrollable full-size formula"
      />
    </dialog>
  )
}
