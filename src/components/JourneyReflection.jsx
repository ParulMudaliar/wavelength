import { useEffect, useState } from 'react'

const SHIFT_OPTIONS = ['Calmer', 'More hopeful', 'Less anxious', 'Motivated']

export default function JourneyReflection({ onReflection, onTryAgain }) {
  const [visible, setVisible] = useState(false)
  const [outcome, setOutcome] = useState(null)
  const [showThankYou, setShowThankYou] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 60000)
    return () => clearTimeout(timer)
  }, [])

  function handleMainChoice(selectedOutcome) {
    setOutcome(selectedOutcome)
    if (selectedOutcome === 'yes') return
    if (selectedOutcome === 'no') {
      onReflection('no', null)
      return
    }
    setShowThankYou(true)
    onReflection(selectedOutcome, null)
  }

  function handleShift(shiftLabel) {
    setShowThankYou(true)
    onReflection('yes', shiftLabel)
  }

  if (!visible) return null

  return (
    <div className="journey-reflection spotify-card">
      <style>{`
        .journey-reflection {
          padding: 1.5rem;
          margin-top: 2rem;
          color: #ffffff;
          font-family: Inter, Circular, sans-serif;
        }
        .journey-reflection__heading {
          margin: 0 0 16px;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }
        .journey-reflection__prompt {
          margin: 0 0 12px;
          font-size: 14px;
          color: #b3b3b3;
        }
        .journey-reflection__thankyou {
          margin: 0;
          font-size: 14px;
          color: #b3b3b3;
        }
        .journey-reflection__tryagain {
          margin: 0 0 16px;
          font-size: 14px;
          color: #b3b3b3;
          line-height: 1.5;
        }
        .journey-reflection__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .reflection-btn {
          border: none;
          background: #282828;
          color: #ffffff;
          border-radius: 50px;
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .reflection-btn:hover {
          background: #3e3e3e;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {showThankYou ? (
        <p className="journey-reflection__thankyou">
          Thank you. This helps Wavelength learn.
        </p>
      ) : outcome === 'no' ? (
        <>
          <p className="journey-reflection__tryagain">
            Sorry this did not land. Would you like to try a different path?
          </p>
          <button type="button" className="reflection-btn" onClick={onTryAgain}>
            Try a different path
          </button>
        </>
      ) : (
        <>
          <h3 className="journey-reflection__heading">Did we get you there?</h3>

          {outcome === null && (
            <div className="journey-reflection__actions">
              <button
                type="button"
                className="reflection-btn"
                onClick={() => handleMainChoice('yes')}
              >
                Yes, I feel different
              </button>
              <button
                type="button"
                className="reflection-btn"
                onClick={() => handleMainChoice('close')}
              >
                Close
              </button>
              <button
                type="button"
                className="reflection-btn"
                onClick={() => handleMainChoice('no')}
              >
                Not really
              </button>
            </div>
          )}

          {outcome === 'yes' && (
            <div>
              <p className="journey-reflection__prompt">What shifted?</p>
              <div className="journey-reflection__actions">
                {SHIFT_OPTIONS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    className="reflection-btn"
                    onClick={() => handleShift(label)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
