export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const { q, limit } = req.query
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(q)}&limit=${limit}`

    console.log('Deezer search URL:', url)

    const response = await fetch(url)

    console.log('Deezer response status:', response.status)

    if (!response.ok) {
      const errorBody = await response.text()
      console.log('Deezer error body:', errorBody)
      return res.status(response.status).json({
        error: `Deezer search failed: ${response.status}`,
      })
    }

    const data = await response.json()
    return res.json(data)
  } catch (err) {
    return res.status(500).json({
      error: err.message || 'Deezer search failed',
    })
  }
}
