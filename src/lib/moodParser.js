function buildFullPrompt(moodText) {
  const artistMap = `
HINDI/BOLLYWOOD feel good: Badshah, Diljit Dosanjh
HINDI/BOLLYWOOD sad: Arijit Singh, Atif Aslam
HINDI/BOLLYWOOD romantic: Arijit Singh, Jubin Nautiyal
HINDI/BOLLYWOOD nostalgic: Kumar Sanu, Udit Narayan
TAMIL feel good: Anirudh Ravichandran
TAMIL sad/emotional: AR Rahman, Ilaiyaraaja
TAMIL romantic: Sid Sriram, AR Rahman
ENGLISH sad: Lewis Capaldi, Olivia Rodrigo, Billie Eilish
ENGLISH happy: Bruno Mars, Harry Styles, Pharrell Williams
ENGLISH chill/indie: Bon Iver, Phoebe Bridgers, Arctic Monkeys
ENGLISH late night: The Weeknd, Frank Ocean, Billie Eilish
ENGLISH romantic: Ed Sheeran, John Legend, Taylor Swift
ENGLISH energetic: Eminem, The Killers, Imagine Dragons
JAZZ: Miles Davis, Norah Jones
CLASSICAL/PIANO: Ludovico Einaudi, Yiruma, Hans Zimmer
LOFI: lofi hip hop study beats`

  return `You are a music expert. Analyze this mood: "${moodText}"

Use this artist reference: ${artistMap}

Return ONLY this JSON with no extra text:
{"currentState":"2-3 words","moodGenome":{"nostalgia":50,"loneliness":30,"hope":60,"wonder":40,"confidence":50,"energy":55,"warmth":60,"focus":45},"journeyPaths":[{"id":"1","label":"Sit With It","description":"Stay in this feeling.","searchQuery":"artist name"},{"id":"2","label":"Recover","description":"Gently lift yourself up.","searchQuery":"artist name"},{"id":"3","label":"Reframe","description":"See it differently.","searchQuery":"artist name"},{"id":"4","label":"Escape","description":"Go somewhere else entirely.","searchQuery":"artist name"}],"moodSummary":"One sentence under 12 words.","wavelengthScore":82}

Rules:
1. Replace all values with ones matching the mood
2. Each searchQuery must be a real artist name from the reference list above, matched to that path's emotional destination
3. If user mentions a specific artist, use that artist in at least one searchQuery
4. All 4 searchQuery values must be different artists
5. loneliness score should only be high if the mood is actually about loneliness
6. Return ONLY valid JSON, nothing else`
}

function stripMarkdownFences(text) {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
}

export async function parseMood(moodText) {
  console.log('Groq key present:', !!import.meta.env.VITE_GROQ_KEY, 'Key starts with:', import.meta.env.VITE_GROQ_KEY?.substring(0, 8))

  const prompt = buildFullPrompt(moodText)

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    throw new Error(`Groq request failed: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  const rawContent = stripMarkdownFences(content)
  const cleanedContent = rawContent.replace(/,(\s*[]}])/g, '$1')

  try {
    return JSON.parse(cleanedContent)
  } catch {
    console.error('Failed to parse AI response:', rawContent)
    throw new Error('AI response was malformed, please try again.')
  }
}
