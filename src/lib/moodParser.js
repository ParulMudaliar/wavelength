function buildFullPrompt(moodText) {
  return `You are a music mood analyzer. Analyze this mood and return ONLY a JSON object, no other text.

Mood: "${moodText}"

Return this exact JSON structure:
{
  "currentState": "2-3 word label",
  "moodGenome": {
    "nostalgia": 50,
    "loneliness": 50,
    "hope": 50,
    "wonder": 50,
    "confidence": 50,
    "energy": 50,
    "warmth": 50,
    "focus": 50
  },
  "journeyPaths": [
    {
      "id": "1",
      "label": "Sit With It",
      "description": "One sentence in second person.",
      "searchQuery": "genre mood artist style keywords for music search"
    },
    {
      "id": "2",
      "label": "Recover",
      "description": "One sentence in second person.",
      "searchQuery": "genre mood artist style keywords for music search"
    },
    {
      "id": "3",
      "label": "Reframe",
      "description": "One sentence in second person.",
      "searchQuery": "genre mood artist style keywords for music search"
    },
    {
      "id": "4",
      "label": "Escape",
      "description": "One sentence in second person.",
      "searchQuery": "genre mood artist style keywords for music search"
    }
  ],
  "moodSummary": "One evocative sentence under 12 words.",
  "wavelengthScore": 85
}

Rules:
- Replace all values with ones matching the mood
- searchQuery must be very short, 2-3 words maximum. Use simple terms like an artist name, a genre, or a mood word. Examples: 'Arijit Singh', 'Bollywood sad', 'Hindi romantic', 'lo-fi chill', 'indie folk melancholic'. Do NOT combine more than 3 words. Simple queries return better results.
- Return ONLY the JSON, no explanation, no markdown`
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
  return JSON.parse(stripMarkdownFences(content))
}
