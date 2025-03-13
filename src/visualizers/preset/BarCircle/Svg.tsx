import { SVG_HEIGHT, SVG_STYLE, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const BarCircleSvg: React.FC<SvgProps> = ({ className }) => {
  const centerX = SVG_WIDTH / 2;
  const centerY = (SVG_HEIGHT / 2) * 1.15; // 额外的乘数让圆心向下偏移一点 -> 达到视觉上的居中

  const radius = Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.35;

  const barWidth = 8;
  const barCount = 32;
  const barHeight = radius * 0.25;

  const angleStep = (2 * Math.PI) / barCount;

  return (
    <g>
      {Array.from({ length: barCount }, (_, i) => {
        const angle = i * angleStep;

        const startX = centerX + radius * Math.cos(angle);
        const startY = centerY + radius * Math.sin(angle);

        const rotationAngle = (angle * 180) / Math.PI + 90;

        return (
          <rect
            key={i}
            className={`${SVG_STYLE} ${className || ""}`}
            width={barWidth}
            height={barHeight}
            x={startX - barWidth / 2}
            y={startY - barHeight}
            transform={`rotate(${rotationAngle}, ${startX}, ${startY - barHeight})`}
          />
        );
      })}
    </g>
  );
};

export default BarCircleSvg;
