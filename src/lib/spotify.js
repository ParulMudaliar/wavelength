export async function searchTracksForMood(query, limit) {
  const response = await fetch(
    `/api/deezer-search?q=${encodeURIComponent(query)}&limit=${limit}`,
  )

  if (!response.ok) {
    throw new Error(`Deezer search failed: ${response.status}`)
  }

  const data = await response.json()

  return data.data
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
