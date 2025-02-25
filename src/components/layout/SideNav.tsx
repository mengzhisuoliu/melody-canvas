import { useEffect, useState } from "react";

import useCanvasStore from "@/stores/canvasStore";
import { AudioVisualizer, BackdropDisplay, ImageProcessor, TextManager } from "../editor";

interface NavItemProps {
  icon: string;
  name: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, name, isActive, onClick }) => (
  <button
    className={`w-16 h-16 rounded-md flex-center flex-col p-1 font-bold border-2 border-dotted text-emerald-800  border-emerald-800 dark:(text-emerald-200 border-emerald-200) ${
      isActive ? "pointer-events-none  bg-emerald-100  dark:bg-dark-300" : "hover:(bg-emerald-100 dark:bg-dark-200)"
    }`}
    onClick={onClick}
  >
    <div className={`${icon} text-2xl my-1`} />
    <span className="text-xs">{name}</span>
  </button>
);

/**
 * 左侧边栏
 */
const SideNav: React.FC = () => {
  const { activeObjects } = useCanvasStore();
  const [activeNav, setActiveNav] = useState<string>("nav-audio");

  const navList = [
    { id: "nav-audio", name: "Audio", icon: "i-icon-park-outline:electric-wave", component: <AudioVisualizer /> },
    { id: "nav-backdrop", name: "Backdrop", icon: "i-geo:turf-size", component: <BackdropDisplay /> },
    { id: "nav-image", name: "Image", icon: "i-lsicon:picture-outline", component: <ImageProcessor /> },
    { id: "nav-text", name: "Text", icon: "i-iconoir:text-square", component: <TextManager /> }
  ];

  useEffect(() => {
    const activeType = activeObjects[0]?.subType;
    if (!activeType) return;

    const matchingNav = navList.find((nav) => nav.id.split("-")[1] === activeType);
    if (matchingNav) {
      setActiveNav(matchingNav.id);
    }
  }, [activeObjects]);

  return (
    <>
      <div
        className="w-24 h-screen left-0 space-x-10 border-r-2 border-emerald-700 bg-emerald-50 flex"
        dark="bg-dark-900 border-dark-200"
      >
        {/* 左侧栏 */}
        <nav className="w-24">
          <div className="px-2 py-4 flex flex-col items-center text-center">
            {/* Logo */}
            <div m="b-6">
              <img
                src="favicon.png"
                className="w-10 h-10 mx-auto rounded-lg shadow-md"
              />
              <div className="py-2 font-sans font-bold text-sm text-emerald-800 dark:text-white">Melody Canvas</div>
            </div>

            {/* 按钮组 */}
            <div className="flex flex-col space-y-8">
              {navList.map((item, index) => (
                <NavItem
                  key={index}
                  icon={item.icon}
                  name={item.name}
                  isActive={activeNav === item.id}
                  onClick={() => setActiveNav(item.id)}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* 对应的子组件 */}
        <div
          className="h-[90vh] w-[18vw] border-2 border-emerald-500 bg-green-50 rounded-md absolute left-18 top-2 p-4"
          dark="bg-dark-400 border-dark-200"
        >
          {navList.map((nav) => (
            <div
              key={nav.id}
              id={nav.id}
              hidden={nav.id !== activeNav}
            >
              {nav.component}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SideNav;
