// Vercel serverless proxy for Google Books.
// Keep GOOGLE_BOOKS_API_KEY in Vercel's server-side environment variables.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: { message: 'Method not allowed' } })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Google Books API is not configured on the server.' } })
  }

  const rawPath = req.query.path
  const pathParts = Array.isArray(rawPath) ? rawPath : rawPath ? [rawPath] : []
  const path = pathParts.join('/')
  if (!/^volumes(?:\/[A-Za-z0-9_-]+)?$/.test(path)) {
    return res.status(400).json({ error: { message: 'Invalid Google Books endpoint.' } })
  }

  const target = new URL(`https://www.googleapis.com/books/v1/${path}`)
  for (const [key, value] of Object.entries(req.query)) {
    if (key === 'path' || key === 'key' || value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value) target.searchParams.append(key, item)
    } else {
      target.searchParams.set(key, value)
    }
  }
  target.searchParams.set('key', apiKey)

  try {
    const upstream = await fetch(target, { headers: { Accept: 'application/json' } })
    const body = await upstream.json()
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=86400')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    return res.status(upstream.status).json(body)
  } catch {
    return res.status(502).json({ error: { message: 'Unable to reach Google Books right now.' } })
  }
}
