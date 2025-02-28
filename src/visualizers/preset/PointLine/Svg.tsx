import { SVG_STYLE, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const PointLineSvg: React.FC<SvgProps> = ({ className }) => {
  const count = 25;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const padding = 30;
        const cx = padding + (i * (SVG_WIDTH - 2 * padding)) / (count - 1);
        const cy = 100 + 20 * Math.sin((i * Math.PI) / 4);
        return (
          <circle
            className={`${SVG_STYLE} ${className || ""}`}
            key={i}
            cx={cx}
            cy={cy}
            r="4"
          />
        );
      })}
    </>
  );
};

export default PointLineSvg;
