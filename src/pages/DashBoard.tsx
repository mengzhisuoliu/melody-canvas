import { AudioControls } from "@/components/audio";
import { CanvasPreview, SideNav, TopNav } from "@/components/layout";

function DashBoard() {
  return (
    <>
      <TopNav />
      <SideNav />
      <CanvasPreview />
      <AudioControls />
    </>
  );
}

export default DashBoard;
