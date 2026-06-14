const PATH_EMOJIS = {
  'Sit With It': '🌊',
  Recover: '🌱',
  Reframe: '🔮',
  Escape: '🚀',
}

export default function JourneyPaths({ paths, onSelect }) {
  return (
    <div className="journey-paths">
      <style>{`
        .journey-paths {
          color: #ffffff;
          max-width: 640px;
          width: 100%;
          font-family: Inter, Circular, sans-serif;
        }
        .journey-paths__heading {
          margin: 0 0 8px;
          font-size: 24px;
          font-weight: 700;
          color: #ffffff;
        }
        .journey-paths__subheading {
          margin: 0 0 24px;
          font-size: 14px;
          color: #b3b3b3;
        }
        .journey-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        @media (max-width: 600px) {
          .journey-grid {
            grid-template-columns: 1fr;
          }
        }
        .journey-card {
          background: #13112a;
          border: none;
          border-radius: 8px;
          min-height: 140px;
          padding: 1.5rem 1.25rem;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .journey-card:hover {
          background: #282828;
          box-shadow: 0 4px 24px rgba(167, 139, 250, 0.12);
        }
        .journey-card--featured {
          box-shadow: 0 0 0 1px #a78bfa;
        }
        .journey-card--featured:hover {
          box-shadow: 0 0 0 1px #a78bfa, 0 4px 24px rgba(167, 139, 250, 0.12);
        }
        .journey-card__label {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 8px;
          color: #ffffff;
        }
        .journey-card__description {
          font-size: 14px;
          color: #b3b3b3;
          line-height: 1.5;
        }
      `}</style>

      <h2 className="journey-paths__heading">Where do you want to go?</h2>
      <p className="journey-paths__subheading">
        Choose the path that feels right. There is no wrong answer.
      </p>

      <div className="journey-grid">
        {paths.map((path) => (
          <button
            key={path.id}
            type="button"
            className={`journey-card${path.label === 'Sit With It' ? ' journey-card--featured' : ''}`}
            onClick={() => onSelect(path)}
          >
            <div className="journey-card__label">
              {PATH_EMOJIS[path.label] ? `${PATH_EMOJIS[path.label]} ` : ''}
              {path.label}
            </div>
            <div className="journey-card__description">{path.description}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
