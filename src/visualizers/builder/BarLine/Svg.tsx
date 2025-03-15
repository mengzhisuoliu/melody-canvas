import { SVG_CLASS, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const BarLineSvg: React.FC<SvgProps> = ({ className }) => {
  const barWidth = 30;
  const gap = 5; // 预留左右两侧间隔
  const barCount = Math.floor((SVG_WIDTH + gap) / (barWidth + gap));

  const totalWidth = barCount * barWidth + (barCount - 1) * gap;
  const offsetX = (SVG_WIDTH - totalWidth) / 2; // 整体居中

  return (
    <g>
      {Array.from({ length: barCount }, (_, i) => {
        const x = offsetX + i * (barWidth + gap);

        const isFirstHalf = i < barCount / 2;
        const height = `${30 + (isFirstHalf ? i * 5 : (barCount - 1 - i) * 5)}%`; // 先低后高再低
        const y = isFirstHalf ? `${100 - (30 + i * 5)}%` : `${100 - (30 + (barCount - 1 - i) * 5)}%`;

        return (
          <rect
            className={`${SVG_CLASS} ${className || ""}`}
            key={i}
            width={barWidth}
            height={height}
            x={x}
            y={y}
          />
        );
      })}
    </g>
  );
};

export default BarLineSvg;
