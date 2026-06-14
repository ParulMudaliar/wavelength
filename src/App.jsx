import { useEffect, useMemo, useState } from 'react'
import MoodInput from './components/MoodInput'
import MoodGenome from './components/MoodGenome'
import JourneyPaths from './components/JourneyPaths'
import TrackCard from './components/TrackCard'
import JourneyReflection from './components/JourneyReflection'
import { parseMood } from './lib/moodParser'
import { searchTracksForMood } from './lib/spotify'
import {
  trackMoodSearch,
  trackJourneySelected,
  trackTrackPreview,
  trackSpotifyOpen,
  trackJourneyReflection,
} from './lib/analytics'
import './App.css'

function formatGenomeLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function getWhyItMatches(genome) {
  return Object.entries(genome)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([key]) => formatGenomeLabel(key))
}

const initialState = {
  step: 'input',
  moodText: '',
  parsedMood: null,
  selectedPath: null,
  tracks: [],
  loading: false,
  error: '',
}

export default function App() {
  const [step, setStep] = useState(initialState.step)
  const [moodText, setMoodText] = useState(initialState.moodText)
  const [parsedMood, setParsedMood] = useState(initialState.parsedMood)
  const [selectedPath, setSelectedPath] = useState(initialState.selectedPath)
  const [tracks, setTracks] = useState(initialState.tracks)
  const [loading, setLoading] = useState(initialState.loading)
  const [error, setError] = useState(initialState.error)

  const whyItMatches = useMemo(
    () => (parsedMood?.moodGenome ? getWhyItMatches(parsedMood.moodGenome) : []),
    [parsedMood],
  )

  const trackScores = useMemo(() => {
    if (!parsedMood || tracks.length === 0) return {}
    return Object.fromEntries(
      tracks.map((track) => [
        track.id,
        parsedMood.wavelengthScore + Math.floor(Math.random() * 11) - 5,
      ]),
    )
  }, [tracks, parsedMood])

  async function handleMoodSubmit(text) {
    setMoodText(text)
    setLoading(true)
    setError('')
    trackMoodSearch(text)

    try {
      const result = await parseMood(text)
      setParsedMood(result)
      setStep('paths')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handlePathSelect(path) {
    trackJourneySelected(path.label)
    setSelectedPath(path)
    setLoading(true)
    setError('')

    try {
      const results = await searchTracksForMood(path.searchQuery, 10)
      setTracks(results)
      setStep('tracks')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleReflection(outcome, shift) {
    trackJourneyReflection(outcome, shift)
  }

  function resetApp() {
    setStep(initialState.step)
    setMoodText(initialState.moodText)
    setParsedMood(initialState.parsedMood)
    setSelectedPath(initialState.selectedPath)
    setTracks(initialState.tracks)
    setLoading(initialState.loading)
    setError(initialState.error)
  }

  const loadingMessage =
    step === 'input'
      ? 'Reading your emotional fingerprint...'
      : 'Building your journey...'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  function handleReflectionTryAgain() {
    setStep('paths')
    setTracks([])
  }

  const hasEnoughTracks = tracks.length >= 1

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-logo">Wavelength</div>
        <div className="app-tagline">Emotional Navigation for Music</div>
      </header>

      <main className="app-container">
        {error && (
          <div className="error-state">
            <span>{error}</span>
            <button type="button" className="error-retry-btn" onClick={() => setError('')}>
              Try again
            </button>
          </div>
        )}

        {loading && <p className="loading">{loadingMessage}</p>}

        {step === 'input' && (
          <MoodInput onSubmit={handleMoodSubmit} loading={loading} />
        )}

        {step === 'paths' && !loading && parsedMood && (
          <div className="paths-container">
            <JourneyPaths
              paths={parsedMood.journeyPaths}
              onSelect={handlePathSelect}
            />
            <MoodGenome
              genome={parsedMood.moodGenome}
              currentState={parsedMood.currentState}
            />
          </div>
        )}

        {step === 'tracks' && selectedPath && parsedMood && (
          <div className="tracks-container">
            <h2 className="tracks-heading">{selectedPath.label}</h2>

            <div className="journey-arc">
              <span>{parsedMood.currentState}</span>
              <span className="journey-arc-arrow" aria-hidden="true">
                →
              </span>
              <span>{selectedPath.label}</span>
            </div>

            {!hasEnoughTracks ? (
              <div className="tracks-empty">
                <p>
                  We could not find enough tracks for this journey. Try a different path
                  or describe your mood differently.
                </p>
                <button
                  type="button"
                  className="start-over-btn"
                  onClick={handleReflectionTryAgain}
                >
                  Try a different path
                </button>
              </div>
            ) : (
              <>
                <div className="tracks-section">
                  {tracks.map((track) => {
                    const artistName = track.artists?.map((a) => a.name).join(', ') ?? ''
                    return (
                      <TrackCard
                        key={track.id}
                        track={track}
                        wavelengthScore={trackScores[track.id]}
                        whyItMatches={whyItMatches}
                        onPreview={() => trackTrackPreview(track.name, artistName)}
                        onSpotifyOpen={() => trackSpotifyOpen(track.name, artistName)}
                      />
                    )
                  })}
                </div>

                <JourneyReflection
                  onReflection={handleReflection}
                  onTryAgain={handleReflectionTryAgain}
                />
              </>
            )}

            <button type="button" className="start-over-btn" onClick={resetApp}>
              Start a new journey
            </button>
          </div>
        )}

        <footer className="app-footer">
          Wavelength uses Spotify catalog and AI mood analysis. Previews are 30 seconds.
        </footer>
      </main>
    </div>
  )
}
