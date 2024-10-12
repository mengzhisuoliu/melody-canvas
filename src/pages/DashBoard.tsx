import MediaControls from "@/components/MediaControls";
import PreviewArea from "@/components/PreviewArea";
import SideNav from "@/components/SideNav";
import TopNav from "@/components/TopNav";

function DashBoard() {
  return (
    <>
      <TopNav />
      <SideNav />
      <PreviewArea />
      <MediaControls />
    </>
  );
}

export default DashBoard;
