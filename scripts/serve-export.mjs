import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.rsc': 'text/x-component; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

export function createExportServer(directory = 'out') {
  const root = fs.realpathSync(directory)
  const insideRoot = (file) => file === root || file.startsWith(`${root}${path.sep}`)

  return http.createServer((request, response) => {
    response.setHeader('Cache-Control', 'no-store')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    const sendError = (status, message) => {
      response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end(message)
    }
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD')
      sendError(405, 'Method not allowed')
      return
    }
    let url
    let file
    try {
      url = new URL(request.url, 'http://localhost')
      const pathname = decodeURIComponent(url.pathname)
      if (pathname.includes('\0')) throw new Error('Invalid path')
      file = path.resolve(root, `.${pathname}`)
    } catch {
      sendError(400, 'Invalid request path')
      return
    }
    if (!insideRoot(file)) {
      sendError(403, 'Path outside the static export')
      return
    }
    try {
      if (fs.statSync(file).isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          response.writeHead(308, { Location: `${url.pathname}/${url.search}` })
          response.end()
          return
        }
        file = path.join(file, 'index.html')
      }
      const real = fs.realpathSync(file)
      if (!insideRoot(real)) {
        sendError(403, 'Path outside the static export')
        return
      }
      const stat = fs.statSync(real)
      if (!stat.isFile()) {
        sendError(404, 'Not found')
        return
      }
      response.writeHead(200, {
        'Content-Type': mimeTypes[path.extname(real)] || 'application/octet-stream',
        'Content-Length': stat.size,
      })
      if (request.method === 'HEAD') {
        response.end()
        return
      }
      const stream = fs.createReadStream(real)
      stream.on('error', () => response.destroy())
      response.once('close', () => stream.destroy())
      stream.pipe(response)
    } catch (error) {
      sendError(['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500, 'Not found')
    }
  })
}

if (import.meta.main) {
  try {
    const port = Number(process.env.PORT || 4173)
    if (!Number.isInteger(port) || port < 0 || port > 65535)
      throw new Error('PORT must be a valid TCP port')
    const server = createExportServer()
    server.on('error', (error) => {
      console.error(error.message)
      process.exitCode = 1
    })
    server.listen(port, '127.0.0.1', () =>
      console.log(`Static export: http://127.0.0.1:${server.address().port}`),
    )
  } catch (error) {
    console.error(`Cannot preview the static export. Run npm run build first. ${error.message}`)
    process.exitCode = 1
  }
}
