import { SVG_WIDTH } from "@/libs/common/constant";
import { VISUAL_MAP, VisualType } from "@/libs/visualizer";
import useCanvasStore from "@/stores/canvasStore";

interface SvgProps {
  type: VisualType;
}

const AudioSvg: React.FC<SvgProps> = ({ type }) => {
  const { canvasInstance } = useCanvasStore();

  const initBuffer = async () => {
    const buffer = VISUAL_MAP[type].init(canvasInstance?.width || 0, canvasInstance?.height || 0);
    canvasInstance!.add(buffer);
  };

  const SvgElement = VISUAL_MAP[type].svg;
  return (
    <svg
      onClick={initBuffer}
      width="100%"
      height="100%"
      viewBox={`0 0 ${SVG_WIDTH} 175`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <SvgElement />
    </svg>
  );
};

const AudioSvgGroup: React.FC = () => {
  return (
    <>
      {Object.keys(VISUAL_MAP).map((key) => {
        return (
          <div
            key={key}
            className="group cursor-pointer rounded-md border-2 border-dotted border-stone-400"
          >
            <AudioSvg type={key as VisualType} />
          </div>
        );
      })}
    </>
  );
};

export default AudioSvgGroup;
