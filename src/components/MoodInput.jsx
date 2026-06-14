import { useState } from 'react'

const EXAMPLE_PROMPTS = [
  'I need to calm my nerves down right away',
  'I am feeling down and need to lift my spirits',
  'There is a lot of noise in my head and I want some me time',
  'I am feeling anxious, play something to make me calm down',
  'I am feeling demotivated and need some motivation',
  'I am stressed out after a long day and want to escape',
]

export default function MoodInput({ onSubmit, loading }) {
  const [moodText, setMoodText] = useState('')

  function handleSubmit() {
    const trimmed = moodText.trim()
    if (!trimmed || loading) return
    onSubmit(trimmed)
  }

  const isDisabled = !moodText.trim() || loading

  return (
    <div className="mood-input">
      <style>{`
        .mood-input {
          color: #ffffff;
          padding: 24px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: Inter, Circular, sans-serif;
        }
        .mood-input__header {
          text-align: center;
          max-width: 560px;
        }
        .mood-input__subtitle {
          margin: 0 0 2rem;
          font-size: 2rem;
          font-weight: 300;
          color: #ffffff;
          text-align: center;
        }
        .mood-input__form {
          width: 100%;
          max-width: 560px;
        }
        .mood-input__textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 16px;
          font-size: 16px;
          line-height: 1.5;
          color: #ffffff;
          background: #13112a;
          border: 1px solid transparent;
          background-clip: padding-box;
          border-radius: 8px;
          resize: vertical;
          outline: none;
          font-family: inherit;
          transition: box-shadow 0.2s ease;
          box-shadow: 0 0 0 1px #2e2e3a, 0 0 20px rgba(167, 139, 250, 0.05);
        }
        .mood-input__textarea:focus {
          box-shadow: 0 0 0 1px #2e2e3a, 0 0 20px rgba(167, 139, 250, 0.15);
        }
        .mood-input__textarea::placeholder {
          color: #b3b3b3;
        }
        .mood-input__submit {
          width: 100%;
          margin-top: 16px;
          padding: 14px 24px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: inherit;
          transition: box-shadow 0.2s ease, transform 0.15s ease;
        }
        .mood-input__submit:hover:not(:disabled) {
          box-shadow: 0 4px 20px rgba(167, 139, 250, 0.4);
          transform: scale(1.01);
        }
        .mood-input__submit:disabled {
          background: #282828;
          color: #b3b3b3;
          cursor: not-allowed;
        }
        .mood-input__pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 24px;
        }
        .mood-input__pill {
          padding: 0.4rem 1rem;
          font-size: 0.8rem;
          line-height: 1.4;
          color: #ffffff;
          background: #282828;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: inherit;
          text-align: center;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .mood-input__pill:hover {
          background: #3e3e3e;
        }
      `}</style>

      <header className="mood-input__header">
        <p className="mood-input__subtitle">How are you feeling right now?</p>
      </header>

      <div className="mood-input__form">
        <textarea
          className="mood-input__textarea"
          value={moodText}
          onChange={(e) => setMoodText(e.target.value)}
          placeholder="Describe your moment... the more honest, the better."
          rows={6}
        />

        <button
          type="button"
          className="mood-input__submit"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          {loading ? 'Reading your mood...' : 'Find my path'}
        </button>

        <div className="mood-input__pills">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="mood-input__pill"
              onClick={() => setMoodText(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
