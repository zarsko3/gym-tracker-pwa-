import React, { useMemo } from 'react';

interface ChartPoint {
  dayLabel: string;
  axisLabel: string;
  value: number;
}

interface DashboardWeightChartProps {
  data: ChartPoint[];
  activeIndex: number;
  activeValueLabel: string;
}

interface Point {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 320;
const VIEWBOX_HEIGHT = 180;
const PADDING_X = 36;
const PADDING_TOP = 30;
const PADDING_BOTTOM = 56;

const createSmoothPath = (points: Point[]) => {
  if (!points.length) return '';

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[i] : points[i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i + 2 < points.length ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
};

const DashboardWeightChart: React.FC<DashboardWeightChartProps> = ({
  data,
  activeIndex,
  activeValueLabel,
}) => {
  const values = data.map((point) => point.value);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const range = maxValue - minValue || 1;

  const points = useMemo<Point[]>(() => {
    if (!data.length) return [];

    const usableWidth = VIEWBOX_WIDTH - PADDING_X * 2;
    const usableHeight = VIEWBOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    return data.map((point, index) => {
      const stepWidth = usableWidth / (data.length - 1 || 1);
      const x = PADDING_X + stepWidth * index;
      const normalizedValue = (point.value - minValue) / range;
      const y = PADDING_TOP + usableHeight * (1 - normalizedValue);

      return { x, y };
    });
  }, [data, minValue, range]);

  const linePath = useMemo(() => createSmoothPath(points), [points]);

  const areaPath = useMemo(() => {
    if (!points.length || !linePath) return '';

    const baselineY = VIEWBOX_HEIGHT - PADDING_BOTTOM + 18;
    const leftIntersectionX = PADDING_X - 42;
    const rightIntersectionX = VIEWBOX_WIDTH - PADDING_X + 42;

    return (
      linePath +
      ` L ${rightIntersectionX} ${baselineY}` +
      ` L ${leftIntersectionX} ${baselineY} Z`
    );
  }, [points, linePath]);

  const activePoint = points[activeIndex];
  const paddedActivePoint = activePoint
    ? {
        x: activePoint.x,
        y: activePoint.y,
      }
    : undefined;

  return (
    <div className="relative rounded-[32px] bg-[rgba(29,22,48,0.85)] border border-white/12 px-6 pt-6 pb-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/8 via-transparent to-transparent pointer-events-none" />

      <div className="relative h-[212px]">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="dashboardChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="dashboardChartStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9DE4FF" />
              <stop offset="50%" stopColor="#A7B9FF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          <rect
            x={PADDING_X}
            y={PADDING_TOP}
            width={VIEWBOX_WIDTH - PADDING_X * 2}
            height={VIEWBOX_HEIGHT - PADDING_TOP - PADDING_BOTTOM}
            fill="url(#dashboardChartFill)"
            opacity={0.12}
          />

          {areaPath && (
            <path d={areaPath} fill="url(#dashboardChartFill)" opacity={0.45} />
          )}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#dashboardChartStroke)"
              strokeWidth={3.6}
              strokeLinecap="round"
            />
          )}

          {paddedActivePoint && (
            <g>
              <line
                x1={paddedActivePoint.x}
                x2={paddedActivePoint.x}
                y1={paddedActivePoint.y}
                y2={VIEWBOX_HEIGHT - PADDING_BOTTOM + 18}
                stroke="rgba(255,255,255,0.35)"
                strokeWidth={1.8}
              />
              <circle
                cx={paddedActivePoint.x}
                cy={paddedActivePoint.y}
                r={7}
                fill="#FAF0A1"
                stroke="#1C132F"
                strokeWidth={3.4}
              />
            </g>
          )}
        </svg>

        {paddedActivePoint && (
          <div
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: `${(paddedActivePoint.x / VIEWBOX_WIDTH) * 100}%`,
              top: `${(paddedActivePoint.y / VIEWBOX_HEIGHT) * 100}%`,
              transform: 'translate(-50%, -68%)',
            }}
          >
            <div className="relative px-5 py-1.5 rounded-full bg-[#FAF0A1] text-[#1C132F] text-[12px] font-semibold tracking-[0.2em] shadow-[0_14px_36px_rgba(250,240,161,0.32)] uppercase">
              {activeValueLabel}
              <span className="absolute -bottom-[5px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-[#FAF0A1]" />
            </div>
            <div className="h-5 w-px bg-[#FAF0A1]/70" />
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
        {data.map((point, index) => (
          <span
            key={`${point.axisLabel}-${index}`}
            className={
              index === activeIndex ? 'text-white' : undefined
            }
          >
            {point.axisLabel}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DashboardWeightChart;

