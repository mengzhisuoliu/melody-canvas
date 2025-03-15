import { SVG_CLASS, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const DotLineSvg: React.FC<SvgProps> = ({ className }) => {
  const count = 25;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const padding = 30;
        const cx = padding + (i * (SVG_WIDTH - 2 * padding)) / (count - 1);
        const cy = 100 + 20 * Math.sin((i * Math.PI) / 4);
        return (
          <circle
            className={`${SVG_CLASS} ${className || ""}`}
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

export default DotLineSvg;
