import { AUDIO_SVG } from "@/libs/css";
import { draggableBar, draggableWave } from "@/libs/draggable";
import useCanvasStore from "@/stores/canvasStore";

/**
 * 柱形图
 */
const svgBar = () => {
  return (
    <g>
      {Array.from({ length: 9 }, (_, i) => {
        const height = `${30 + i * 5}%`;
        const x = `${6.5 + i * 10}%`;
        const y = i < 5 ? `${70 - i * 5}%` : `${50 + (i - 4) * 5}%`;
        return <rect className={AUDIO_SVG} key={i} width="7%" height={height} x={x} y={y} />;
      })}
    </g>
  );
};

/**
 * 波形图
 */
const svgWave = () => {
  const count = 25;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const width = 400;
        const padding = 30;
        const cx = padding + (i * (width - 2 * padding)) / (count - 1);
        const cy = 100 + 20 * Math.sin((i * Math.PI) / 4);
        return <circle className={AUDIO_SVG} key={i} cx={cx} cy={cy} r="4" />;
      })}
    </>
  );
};

const ELEMENT_MAP = {
  bar: {
    svg: svgBar,
    draggable: draggableBar
  },
  wave: {
    svg: svgWave,
    draggable: draggableWave
  }
};

interface AudioVizElProps {
  type: keyof typeof ELEMENT_MAP;
}

const AudioSvg: React.FC<AudioVizElProps> = ({ type }) => {
  const { fabricInstance, updateFabric } = useCanvasStore();

  const handleDraggable = () => {
    const draggableEl = ELEMENT_MAP[type].draggable(fabricInstance?.width || 0, fabricInstance?.height || 0);
    updateFabric(draggableEl);
  };

  const SvgEl = ELEMENT_MAP[type].svg;

  return (
    <svg onClick={handleDraggable} width="100%" height="100%" viewBox="0 0 400 175" xmlns="http://www.w3.org/2000/svg">
      {SvgEl ? <SvgEl /> : null}
    </svg>
  );
};

const AudioSvgGroup: React.FC = () => {
  return (
    <>
      {Object.keys(ELEMENT_MAP).map((key) => {
        return (
          <div
            key={key}
            className="group cursor-pointer rounded-md border-2 border-dotted border-stone-400 hover:bg-dark-400"
          >
            <AudioSvg type={key as keyof typeof ELEMENT_MAP} />
          </div>
        );
      })}
    </>
  );
};

export default AudioSvgGroup;
