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
  title: string;
  description: string;
}

interface Point {
  x: number;
  y: number;
}

const VIEWBOX_WIDTH = 322;
const VIEWBOX_HEIGHT = 196;
const PADDING_X = 34;
const PADDING_TOP = 80;
const PADDING_BOTTOM = 35;

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
  title,
  description,
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

    const baselineY = VIEWBOX_HEIGHT - PADDING_BOTTOM + 20;
    const leftIntersectionX = PADDING_X - 20;
    const rightIntersectionX = VIEWBOX_WIDTH - PADDING_X + 20;

    return (
      linePath +
      ` L ${rightIntersectionX} ${baselineY}` +
      ` L ${leftIntersectionX} ${baselineY} Z`
    );
  }, [points, linePath]);

  const activePoint = points[activeIndex];

  return (
    <div className="relative rounded-[28px] border border-white/10 bg-[rgba(27,21,48,0.85)] px-6 pt-6 pb-6 shadow-[0_16px_40px_rgba(6,2,25,0.4)] backdrop-blur">
      <div className="relative flex items-center justify-between mb-5">
        <div>
          <p className="text-[16px] font-bold text-white">{title}</p>
          <p className="mt-1 text-[12px] font-medium text-white/60">{description}</p>
        </div>
      </div>

      <div className="relative h-[175px]">
        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          className="h-full w-full"
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <linearGradient id="dashboardChartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
            </linearGradient>
            <linearGradient id="dashboardChartStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#9DE4FF" />
              <stop offset="50%" stopColor="#B6C4FF" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
          </defs>

          {areaPath && (
            <path d={areaPath} fill="url(#dashboardChartFill)" opacity={0.5} />
          )}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#dashboardChartStroke)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          )}

          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={activePoint.y}
                y2={VIEWBOX_HEIGHT - PADDING_BOTTOM + 18}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={1.2}
                strokeDasharray="3 4"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r={5.5}
                fill="#FAF0A1"
                stroke="#1C132F"
                strokeWidth={2}
              />
            </g>
          )}
        </svg>

        {activePoint && (
          <div
            className="pointer-events-none absolute flex flex-col items-center"
            style={{
              left: `${(activePoint.x / VIEWBOX_WIDTH) * 100}%`,
              top: `${(activePoint.y / VIEWBOX_HEIGHT) * 100}%`,
              transform: 'translate(-50%, calc(-100% - 12px))',
            }}
          >
            <div className="relative rounded-full bg-[#FAF0A1] px-5 py-2 text-[12px] font-bold text-[#1C132F] shadow-[0_8px_24px_rgba(250,240,161,0.35)] flex items-center justify-center">
              {activeValueLabel}
              <span className="absolute -bottom-[5px] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rotate-45 bg-[#FAF0A1]" />
            </div>
            <div className="h-4 w-[1px] bg-[#FAF0A1]/60" />
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-7 text-[11px] font-medium text-white/45">
        {data.map((point, index) => (
          <span key={`${point.axisLabel}-${index}`} className={`text-center ${index === activeIndex ? 'text-white font-semibold' : undefined}`}>
            {point.axisLabel}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DashboardWeightChart;

