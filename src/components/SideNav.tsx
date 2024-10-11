import { useState } from "react";
import AudioUploader from "./AudioUploader";
import ImageProcessor from "./ImageProcessor";
import TextEditor from "./TextEditor";
import WaveDisplay from "./WaveDisplay";

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
    <div className={`${icon} text-2xl mb-1`} />
    <span text="sm">{label}</span>
  </button>
);

const SideNav: React.FC = () => {
  const [activeNav, setActiveNav] = useState<string>("Audio");

  const navList = [
    { icon: "i-line-md:folder-music", label: "Audio", component: <AudioUploader /> },
    { icon: "i-mingcute-wave-line", label: "Wave", component: <WaveDisplay /> },
    { icon: "i-tabler:photo", label: "Image", component: <ImageProcessor /> },
    { icon: "i-solar:text-selection-linear", label: "Text", component: <TextEditor /> }
  ];

  return (
    <>
      <div className="flex space-x-10">
        {/* 左侧栏 */}
        <nav className="h-screen w-24 bg-dark-800">
          <div className="px-2 py-4 flex flex-col items-center text-center">
            {/* Logo */}
            <div m="b-6">
              <img src="favicon.png" width={36} m="x-auto" />
              <div p="y-2" text="sm" font="bold">
                Melody Canvas
              </div>
              <div className="h-0.5 w-full bg-dark-100"></div>
            </div>

            {/* 按钮组 */}
            <div font="mono" space="y-8">
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
        <div className="h-[90vh] w-[15vw] bg-dark-400 rounded-md absolute transform translate-y-[-50%] top-[calc(50%-32px)] left-18 p-4">
          {navList.find((item) => item.label === activeNav)?.component}
        </div>
      </div>
    </>
  );
};

export default SideNav;
