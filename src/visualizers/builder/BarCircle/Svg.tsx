import { SVG_HEIGHT, SVG_CLASS, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const BarCircleSvg: React.FC<SvgProps> = ({ className }) => {
  const BAR_WIDTH = 8;
  const BAR_COUNT = 32;

  const angleStep = (2 * Math.PI) / BAR_COUNT;
  const centerX = SVG_WIDTH / 2;
  const centerY = (SVG_HEIGHT / 2) * 1.15; // 额外的乘数让圆心向下偏移一点 -> 达到视觉上的居中
  const radius = Math.min(SVG_WIDTH, SVG_HEIGHT) * 0.35;
  const barHeight = radius * 0.25;

  return (
    <g>
      {Array.from({ length: BAR_COUNT }, (_, i) => {
        const angle = i * angleStep;

        const startX = centerX + radius * Math.cos(angle);
        const startY = centerY + radius * Math.sin(angle);

        const rotationAngle = (angle * 180) / Math.PI + 90;

        return (
          <rect
            key={i}
            className={`${SVG_CLASS} ${className || ""}`}
            width={BAR_WIDTH}
            height={barHeight}
            x={startX - BAR_WIDTH / 2}
            y={startY - barHeight}
            transform={`rotate(${rotationAngle}, ${startX}, ${startY - barHeight})`}
          />
        );
      })}
    </g>
  );
};

export default BarCircleSvg;
