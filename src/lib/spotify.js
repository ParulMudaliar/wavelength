export async function searchTracksForMood(query, limit) {
  const url = `https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=${limit}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Deezer search failed: ${response.status}`)
  }

  const data = await response.json()

  return data.data
    .filter((track) => track.preview)
    .slice(0, limit)
    .map((track) => ({
      id: track.id,
      name: track.title,
      artists: [{ name: track.artist.name }],
      album: {
        name: track.album.title,
        images: [{ url: track.album.cover_medium }],
      },
      preview_url: track.preview,
      external_urls: { spotify: track.link },
    }))
}
