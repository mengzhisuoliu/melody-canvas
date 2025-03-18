import { SVG_CLASS, SVG_HEIGHT, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const DotCircleSvg: React.FC<SvgProps> = ({ className }) => {
  const RADIUS = 60;
  const COUNT = 30;

  const angleStep = (2 * Math.PI) / COUNT;
  const centerX = SVG_WIDTH / 2; 
  const centerY = SVG_HEIGHT / 2;

  const points = Array.from({ length: COUNT }).map((_, index) => {
    const angle = index * angleStep;
    const x = centerX + RADIUS * Math.cos(angle);
    const y = centerY + RADIUS * Math.sin(angle);
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
