import type { Element, ElementContent, Properties, Root, RootContent } from 'hast'

function element(
  tagName: string,
  properties: Properties = {},
  children: ElementContent[] = [],
): Element {
  return { type: 'element', tagName, properties, children }
}

function text(value: string): ElementContent {
  return { type: 'text', value }
}

function plainText(node: RootContent | ElementContent): string {
  if (node.type === 'text') return node.value
  if ('children' in node) return node.children.map(plainText).join('')
  return ''
}

// Runs before KaTeX, so headings are read once from their original text, not from
// duplicate MathML/visual representations. Footnotes are moved, never cloned.
export function rehypeReadingLayout() {
  return (tree: Root) => {
    const footnotes = tree.children.find(
      (node): node is Element =>
        node.type === 'element' &&
        node.tagName === 'section' &&
        Boolean(node.properties.dataFootnotes),
    )
    const main = tree.children.filter(
      (node) => node !== footnotes && node.type !== 'doctype',
    ) as ElementContent[]
    const usedIds = new Set(['post-subject'])
    const headings: { level: number; title: string; id: string }[] = []

    function collectIds(nodes: ElementContent[], includeHeadings = true) {
      for (const node of nodes) {
        if (node.type !== 'element') continue
        if (node.properties.id && (includeHeadings || !/^h[123]$/.test(node.tagName)))
          usedIds.add(String(node.properties.id))
        collectIds(node.children, includeHeadings)
      }
    }
    if (footnotes) collectIds([footnotes])
    collectIds(main, false)

    function collectHeadings(nodes: ElementContent[]) {
      for (const node of nodes) {
        if (node.type !== 'element') continue
        if (['h1', 'h2', 'h3'].includes(node.tagName)) {
          const title = plainText(node).trim()
          // Preserve existing article fragment URLs; only collisions gain suffixes.
          const base = String(
            node.properties.id ||
              title
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\p{L}\p{N}-]/gu, '') ||
              'heading',
          )
          let id = base
          for (let suffix = 2; usedIds.has(id); suffix++) id = `${base}-${suffix}`
          usedIds.add(id)
          node.properties.id = id
          if (node.tagName === 'h1') node.tagName = 'h2'
          if (title) headings.push({ level: node.tagName === 'h3' ? 3 : 2, title, id })
        }
        collectHeadings(node.children)
      }
    }
    collectHeadings(main)

    const columns: ElementContent[] = []
    if (headings.length) {
      columns.push(
        element(
          'nav',
          { className: ['post-toc'], dataPostToc: true, ariaLabel: 'Table of contents' },
          [
            element('details', {}, [
              element('summary', {}, [text('Contents')]),
              element(
                'ol',
                {},
                headings.map((heading) =>
                  element('li', { className: heading.level === 3 ? ['post-toc-nested'] : [] }, [
                    element('a', { href: `#${heading.id}` }, [text(heading.title)]),
                  ]),
                ),
              ),
            ]),
          ],
        ),
      )
    }
    columns.push(element('div', { dataPostMain: true }, main))
    if (footnotes) {
      const label = footnotes.children.find(
        (node): node is Element => node.type === 'element' && /^h[1-6]$/.test(node.tagName),
      )
      if (label) label.properties.className = ['post-footnote-heading']
      columns.push(
        element(
          'aside',
          {
            className: ['post-footnotes'],
            ariaLabelledBy: [String(label?.properties.id || 'footnote-label')],
          },
          [footnotes],
        ),
      )
    }
    tree.children = [
      element('div', { className: ['post-reading-layout'], dataReadingLayout: true }, columns),
    ]
  }
}
