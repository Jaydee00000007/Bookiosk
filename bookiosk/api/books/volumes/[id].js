// Explicit Vercel function for individual Google Books volume requests.
// This route avoids relying on the catch-all route for /volumes/:id.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ error: { message: 'Method not allowed' } })
  }

  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: { message: 'Google Books API is not configured on the server.' } })
  }

  const rawId = req.query?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return res.status(400).json({ error: { message: 'A valid Google Books volume ID is required.' } })
  }

  const target = new URL(`https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(id)}`)
  const incomingUrl = new URL(req.url, `https://${req.headers.host || 'localhost'}`)
  for (const [key, value] of incomingUrl.searchParams.entries()) {
    if (key === 'id' || key === 'key') continue
    target.searchParams.append(key, value)
  }
  target.searchParams.set('key', apiKey)

  try {
    const upstream = await fetch(target, {
      headers: { Accept: 'application/json' },
      cache: 'no-store'
    })
    const responseText = await upstream.text()
    let body = null

    if (responseText) {
      try {
        body = JSON.parse(responseText)
      } catch {
        body = null
      }
    }

    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('Content-Type', 'application/json; charset=utf-8')

    if (!upstream.ok) {
      const message = body?.error?.message || `Google Books returned HTTP ${upstream.status}.`
      return res.status(upstream.status).json({ error: { message } })
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return res.status(502).json({ error: { message: 'Google Books returned an empty or invalid response. Please retry your request.' } })
    }

    return res.status(200).json(body)
  } catch {
    return res.status(502).json({ error: { message: 'Unable to reach Google Books right now.' } })
  }
}
