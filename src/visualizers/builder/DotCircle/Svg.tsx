import { SVG_HEIGHT, SVG_CLASS, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const DotCircleSvg: React.FC<SvgProps> = ({ className }) => {
  const radius = 60;
  const count = 30;
  const angleStep = (2 * Math.PI) / count;

  const centerX = SVG_WIDTH / 2; 
  const centerY = SVG_HEIGHT / 2;

  const points = Array.from({ length: count }).map((_, index) => {
    const angle = index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  });
  
  return (
    <>
      {points.map((point, i) => (
        <circle
          className={`${SVG_CLASS} ${className || ""}`}
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
        />
      ))}
    </>
  );
};

export default DotCircleSvg;
