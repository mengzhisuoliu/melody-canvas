import { useEffect, useRef, useState } from "react";

import { SVG_HEIGHT, SVG_WIDTH } from "@/libs/common";
import type { SvgProps } from "@/visualizers/types";

const svgModules = import.meta.glob("@/visualizers/builder/*/Svg.tsx", { eager: true });

type AudioSvgList = {
  [name: string]: React.FC<SvgProps>;
};

interface AudioSvgSelectProps {
  name: string;
  disabled?: boolean;
  onChange(name: string): void;
}

const AudioSvgSelect: React.FC<AudioSvgSelectProps> = ({ name, disabled, onChange }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [svgList, setSvgList] = useState<AudioSvgList>({});

  useEffect(() => {
    const loadSvgList = async () => {
      const loadedSvgList: AudioSvgList = {};

      for (const path in svgModules) {
        const module = svgModules[path] as { default: React.FC };
        const svgName = path.split("/").slice(-2, -1)[0];
        loadedSvgList[svgName] = module.default;
      }
  
      setSvgList(loadedSvgList);
  
      const firstSvg = Object.keys(loadedSvgList)[0];
      onChange(firstSvg);
    };

    loadSvgList();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSvgSelect = (name: string) => {
    if (disabled) return;
    onChange(name);
    setIsOpen(false);
  };

  const SelectedSvgPath = name ? svgList[name] : null;

  return (
    <div
      className="relative flex flex-col items-center"
      ref={dropdownRef}
    >
      <div
        className={`cursor-pointer w-full flex-between bg-white rounded-md p-4 border border-dashed ${
          isOpen ? "border-emerald-600" : "border-stone-400"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        dark="bg-dark-400"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        {SelectedSvgPath && (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <SelectedSvgPath />
          </svg>
        )}
        <div
          className={`i-carbon-chevron-down transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          dark="text-gray"
        />
      </div>

      {/* 下拉框 */}
      <div
        className={`absolute max-h-80 top-27 z-50 w-[110%] overflow-y-auto bg-white rounded p-2 shadow-md ${
          isOpen ? "dropdown-open" : "dropdown-closed"
        }`}
        dark="bg-dark-800"
      >
        {Object.keys(svgList).map((key) => {
          const SvgPath = svgList[key];
          const isSelected = name === key;
          return (
            <button
              key={key}
              className={`h-16 w-full rounded-md ${
                isSelected ? "pointer-events-none bg-emerald-50 dark:bg-dark-200" : "cursor-pointer"
              }`}
              onClick={() => handleSvgSelect(key)}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${SVG_WIDTH} 175`}
                xmlns="http://www.w3.org/2000/svg"
                className="group w-full h-full"
              >
                <SvgPath
                  className={isSelected ? "" : "group-hover:fill-emerald-400 dark:group-hover:fill-emerald-300"}
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AudioSvgSelect;
