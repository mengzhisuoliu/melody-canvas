const BackdropDisplay: React.FC = () => {
  return (
    <>
      <div>
        {/* 尺寸 */}
        <button className="w-full flex-between bg-dark-100 hover:bg-dark-50 py-2 px-3 rounded-md">
          <div className="flex-center">
            <div className="i-mingcute:display-line text-lg mr-1"></div>
            <div>Size</div>
          </div>
          <span text="stone-200">16:9</span>
        </button>
      </div>
    </>
  );
};

export default BackdropDisplay;
