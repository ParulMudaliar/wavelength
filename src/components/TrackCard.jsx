import { useEffect, useRef, useState } from 'react'

let activeAudio = null

function pauseAllPageAudio() {
  document.querySelectorAll('audio').forEach((el) => el.pause())
  if (activeAudio) {
    activeAudio.pause()
  }
}

export default function TrackCard({
  track,
  wavelengthScore,
  whyItMatches,
  onPreview,
  onSpotifyOpen,
}) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const hasPreviewedRef = useRef(false)

  const artistName = track.artists?.map((a) => a.name).join(', ') ?? ''
  const albumName = track.album?.name ?? ''
  const albumArt = track.album?.images?.[0]?.url
  const hasPreview = Boolean(track.preview_url)

  useEffect(() => {
    if (!hasPreview) return

    audioRef.current = new Audio(track.preview_url)
    const audio = audioRef.current

    audio.onended = () => setPlaying(false)

    return () => {
      audio.pause()
      audio.currentTime = 0
      if (activeAudio === audio) {
        activeAudio = null
      }
    }
  }, [track.preview_url, hasPreview])

  function handlePlayClick() {
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }

    if (!hasPreviewedRef.current) {
      hasPreviewedRef.current = true
      onPreview()
    }

    pauseAllPageAudio()
    audio.play()
    activeAudio = audio
    setPlaying(true)
  }

  function handleSpotifyClick() {
    onSpotifyOpen()
  }

  return (
    <div className="track-card">
      <style>{`
        .track-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          font-family: Inter, Circular, sans-serif;
          background: #13112a;
          border: none;
          border-left: 3px solid #a78bfa;
          border-radius: 8px;
          transition: box-shadow 0.2s ease;
        }
        .track-card:hover {
          box-shadow: 0 4px 24px rgba(167, 139, 250, 0.12);
        }
        .track-card__art {
          border-radius: 4px;
          flex-shrink: 0;
          object-fit: cover;
        }
        .track-card__art-placeholder {
          width: 72px;
          height: 72px;
          border-radius: 4px;
          flex-shrink: 0;
          background: #282828;
        }
        .track-card__info {
          flex: 1;
          min-width: 0;
        }
        .track-card__name {
          font-weight: 700;
          font-size: 14px;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .track-card__artist {
          font-size: 13px;
          color: #b3b3b3;
          margin-top: 2px;
        }
        .track-card__album {
          font-size: 11px;
          color: #b3b3b3;
          opacity: 0.7;
          margin-top: 2px;
        }
        .track-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        }
        .track-card__tag {
          background: #282828;
          border: none;
          border-radius: 50px;
          font-size: 0.75rem;
          color: #a78bfa;
          padding: 4px 10px;
        }
        .track-card__spotify-link {
          display: inline-block;
          margin-top: 8px;
          font-size: 0.7rem;
          color: #1db954;
          text-decoration: none;
          font-weight: 600;
        }
        .track-card__spotify-link:hover {
          text-decoration: underline;
        }
        .track-card__score {
          text-align: center;
          flex-shrink: 0;
        }
        .track-card__score-value {
          font-size: 18px;
          font-weight: 700;
          color: #a78bfa;
        }
        .track-card__score-label {
          font-size: 10px;
          color: #b3b3b3;
          margin-top: 2px;
        }
        .track-card__play {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #ffffff;
          color: #121212;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          padding: 0;
          transition: transform 0.15s ease;
        }
        .track-card__preview-unavailable {
          margin-top: 8px;
          font-size: 0.7rem;
          color: #b3b3b3;
        }
        .track-card__play:hover {
          transform: scale(1.05);
        }
      `}</style>

      {albumArt ? (
        <img
          className="track-card__art"
          src={albumArt}
          alt=""
          width={72}
          height={72}
        />
      ) : (
        <div className="track-card__art-placeholder" />
      )}

      <div className="track-card__info">
        <div className="track-card__name">{track.name}</div>
        <div className="track-card__artist">{artistName}</div>
        <div className="track-card__album">{albumName}</div>

        <div className="track-card__tags">
          {whyItMatches.map((reason) => (
            <span key={reason} className="track-card__tag">
              {reason}
            </span>
          ))}
        </div>

        {!hasPreview && (
          <p className="track-card__preview-unavailable">Preview unavailable</p>
        )}

        <a
          className="track-card__spotify-link"
          href={track.external_urls?.spotify}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleSpotifyClick}
        >
          Open in Deezer
        </a>
      </div>

      <div className="track-card__score">
        <div className="track-card__score-value">{wavelengthScore}%</div>
        <div className="track-card__score-label">match</div>
      </div>

      {hasPreview ? (
        <button
          type="button"
          className="track-card__play"
          onClick={handlePlayClick}
          aria-label={playing ? 'Pause preview' : 'Play preview'}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <rect x="1" y="1" width="3" height="10" rx="0.5" />
              <rect x="8" y="1" width="3" height="10" rx="0.5" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M2 1.5v9l8-4.5-8-4.5z" />
            </svg>
          )}
        </button>
      ) : null}
    </div>
  )
}
