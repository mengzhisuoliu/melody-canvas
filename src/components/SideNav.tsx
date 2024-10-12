import { useState } from "react";

import AudioUploader from "./AudioUploader";
import BackdropDisplay from "./BackdropDisplay";
import ImageProcessor from "./ImageProcessor";
import TextEditor from "./TextEditor";

interface NavItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => (
  <button
    className={`w-16 h-16 rounded-md bg-dark-100 flex-center flex-col p-1 ${
      isActive ? "pointer-events-none border-2 border-dotted border-emerald-400 text-emerald-300" : "hover:bg-dark-50"
    }
      `}
    onClick={onClick}
  >
    <div className={`${icon} text-2xl my-1`} />
    <span text="xs">{label}</span>
  </button>
);

const SideNav: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>("Audio");

  const navList = [
    { icon: "i-icon-park-outline:electric-wave", label: "Audio", component: <AudioUploader /> },
    { icon: "i-geo:turf-size", label: "Backdrop", component: <BackdropDisplay /> },
    { icon: "i-lsicon:picture-outline", label: "Image", component: <ImageProcessor /> },
    { icon: "i-iconoir:text-square", label: "Text", component: <TextEditor /> }
  ];

  return (
    <>
      <div className="absolute h-screen left-0 space-x-10 bg-dark-800">
        {/* 左侧栏 */}
        <nav className="w-24">
          <div className="px-2 py-4 flex flex-col items-center text-center">
            {/* Logo */}
            <div m="b-6">
              <img src="favicon.png" width={36} m="x-auto" />
              <div p="y-2" text="sm" font="bold sans">
                Melody Canvas
              </div>
            </div>

            {/* 按钮组 */}
            <div space="y-8" className="flex flex-col">
              {navList.map((item, index) => (
                <NavItem
                  key={index}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeNav === item.label}
                  onClick={() => setActiveNav(item.label)}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* 对应的子组件 */}
        <div className="h-[90vh] w-[18vw] bg-dark-500 rounded-md absolute transform translate-y-[-50%] top-[calc(50%-32px)] left-18 p-4">
          {navList.find((item) => item.label === activeNav)?.component}
        </div>
      </div>
    </>
  );
};

export default SideNav;
