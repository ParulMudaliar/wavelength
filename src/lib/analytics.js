import posthog from 'posthog-js'

posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  defaults: '2025-05-24',
})

export function trackMoodSearch(moodText) {
  posthog.capture('mood_searched', { mood_length: moodText.length })
}

export function trackJourneySelected(pathway) {
  posthog.capture('journey_selected', { pathway })
}

export function trackTrackPreview(trackName, artist) {
  posthog.capture('track_previewed', { track_name: trackName, artist })
}

export function trackSpotifyOpen(trackName, artist) {
  posthog.capture('spotify_opened', { track_name: trackName, artist })
}

export function trackJourneyReflection(outcome, shift) {
  const properties = { outcome }
  if (shift != null && shift !== '') {
    properties.shift = shift
  }
  posthog.capture('journey_reflection', properties)
}
