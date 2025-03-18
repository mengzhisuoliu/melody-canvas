import { SVG_CLASS, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "../../types";

const DotLineSvg: React.FC<SvgProps> = ({ className }) => {
  const COUNT = 25;
  const PADDING = 30;

  return (
    <>
      {Array.from({ length: COUNT }, (_, i) => {
        const cx = PADDING + (i * (SVG_WIDTH - 2 * PADDING)) / (COUNT - 1);
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
