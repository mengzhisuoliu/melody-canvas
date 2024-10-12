const TopNav: React.FC = () => {
  return (
    <>
      <div className="absolute top-5 right-8 z-10">
        <button className="w-46 flex-center px-2 py-1 bg-dark-800 hover:bg-dark-400 border-2 border-dark-50  rounded-md text-lg">
          <div className="i-ri:folder-video-line mr-4 text-xl"></div>
          <span>Export Video</span>
        </button>
      </div>
    </>
  );
};

export default TopNav;
