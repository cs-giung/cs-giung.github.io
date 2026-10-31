import fs from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline/promises'
const redirects = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'data', 'blog-redirects.json'), 'utf8'),
)

const BLOG_DIR = path.join(process.cwd(), 'data', 'blog')
const DRAFT_DIR = path.join(process.cwd(), '.local', 'drafts', 'blog')

function slugify(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

async function main() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  try {
    console.log('--- Create New Blog Post ---')
    const title = (await rl.question('Post Title: ')).trim()
    const slug = slugify(title)
    if (!slug) throw new Error('Title must contain at least one letter or number.')
    const filename = `${slug}.md`
    if (
      fs.existsSync(path.join(BLOG_DIR, filename)) ||
      fs.existsSync(path.join(DRAFT_DIR, filename)) ||
      Object.hasOwn(redirects, slug)
    ) {
      throw new Error(`The URL /blog/${slug}/ is already in use.`)
    }

    const author = (await rl.question('Author (default: Giung Nam): ')).trim() || 'Giung Nam'
    const typeChoice = await rl.question('Type (1: Article, 2: Note, 3: Excerpt) [default: 1]: ')
    const type = typeChoice === '2' ? 'note' : typeChoice === '3' ? 'excerpt' : 'article'
    const category = type === 'article' ? 'Posts' : 'Notes & Scribbles'
    const description = (await rl.question('Description (optional): ')).trim()
    const draft = (await rl.question('Save as draft? [Y/n]: ')).trim().toLowerCase() !== 'n'
    const date = new Date().toISOString().split('T')[0]
    const metadata = { title, date, author, category, type, draft, description }
    const frontmatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join('\n')

    const directory = draft ? DRAFT_DIR : BLOG_DIR
    const filePath = path.join(directory, filename)
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(filePath, `---\n${frontmatter}\n---\n\nWrite your content here...\n`, {
      flag: 'wx',
    })
    console.log(`\nCreated: ${path.relative(process.cwd(), filePath)}`)
    console.log(
      draft
        ? 'Private draft: set draft to false and move it to data/blog only when ready to publish.'
        : `URL: /blog/${slug}/`,
    )
  } finally {
    rl.close()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
