import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

const DIMENSIONS = [
  'nostalgia',
  'loneliness',
  'hope',
  'wonder',
  'confidence',
  'energy',
  'warmth',
  'focus',
]

function formatLabel(key) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

export default function MoodGenome({ genome, currentState }) {
  const chartData = DIMENSIONS.map((key) => ({
    dimension: formatLabel(key),
    value: genome[key] ?? 0,
  }))

  return (
    <div className="mood-genome spotify-card">
      <style>{`
        .mood-genome {
          padding: 1rem;
          max-width: 360px;
          color: #ffffff;
          font-family: Inter, Circular, sans-serif;
        }
        .mood-genome__state {
          margin: 0 0 4px;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
        }
        .mood-genome__subtitle {
          margin: 0 0 12px;
          font-size: 12px;
          color: #b3b3b3;
          line-height: 1.4;
        }
      `}</style>

      <p className="mood-genome__state">Your current state: {currentState}</p>
      <p className="mood-genome__subtitle">
        Your Mood Genome — how your emotional fingerprint looks right now
      </p>

      <ResponsiveContainer width={320} height={280}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#282828" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#b3b3b3', fontSize: 11 }}
          />
          <Radar
            dataKey="value"
            stroke="#a78bfa"
            strokeWidth={2}
            fill="#a78bfa"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
