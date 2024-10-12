import useMediaStore from "@/stores/mediaStore";

const AudioUploader: React.FC = () => {
  const { audioMeta, setAudioMeta } = useMediaStore();

  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioMeta({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
  };

  const formatAudioName = () => {
    if (!audioMeta)
      return (
        <>
          <span text="lg">Upload a File</span>
          <div className="i-line-md:uploading-loop text-2xl ml-4"></div>
        </>
      );

    const name = audioMeta.name.split(".").slice(0, -1).join(".");
    const ext = audioMeta.name.split(".").pop();
    return (
      <>
        <span className="inline-block overflow-hidden text-ellipsis max-w-32">{name}</span>
        <span>.{ext}</span>
        <div className="i-solar:refresh-square-outline ml-4 text-xl"></div>
      </>
    );
  };

  return (
    <>
      <div>
        <div>
          {/* 音频上传 */}
          <label className="p-1 hover:text-stone-200 flex-center">
            <div className="w-full whitespace-nowrap flex-center">{formatAudioName()}</div>
            <input type="file" accept="audio/*" className="hidden" onChange={handleAudioChange} />
          </label>
          {/* 分割线 */}
          <div className="h-0.5 w-full border-b-2 border-dotted border-dark-50 py-1"></div>
        </div>
      </div>
    </>
  );
};

export default AudioUploader;
