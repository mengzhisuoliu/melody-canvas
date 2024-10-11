const MediaControls: React.FC = () => {
  return (
    <>
      <div className="bg-dark-300 w-screen h-16 absolute bottom-0 flex items-center">
        {/* 播放按钮 */}
        <button className="w-10 h-10 rounded-full bg-emerald-300 ml-7 flex-center">
          <div className="w-6 h-6 i-solar:play-bold"></div>
        </button>
      </div>
    </>
  );
};

export default MediaControls;
