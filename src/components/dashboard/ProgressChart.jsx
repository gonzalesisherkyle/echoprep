
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * @param {{ points: { date: string, score: number }[], isReducedMotion: boolean }} props
 */
export function ProgressChart({ points, isReducedMotion }) {
  return (
    <div className="rounded-lg bg-surface p-5 border border-border">
      <h3 className="text-lg font-semibold text-text mb-4">Progress</h3>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={points}
            margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              stroke="var(--color-border)"
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
              stroke="var(--color-border)"
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-surface-raised)',
                borderColor: 'var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text)',
              }}
              labelStyle={{ color: 'var(--color-muted)' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-primary)', r: 4 }}
              activeDot={{ fill: 'var(--color-primary-hover)', r: 6 }}
              isAnimationActive={!isReducedMotion}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProgressChart;

