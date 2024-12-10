import useAudioStore from "@/stores/audioStore";
import AudioSvgGroup from "./AudioSvgGroup";

const AudioUploader: React.FC = () => {
  const { audioFile, setAudioFile } = useAudioStore();

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const formatAudioName = () => {
    if (!audioFile)
      return (
        <>
          <span text="lg">Upload a File</span>
          <div className="i-line-md:uploading-loop text-2xl ml-4"></div>
        </>
      );

    // 避免文件名过长的情况
    const name = audioFile.name.split(".").slice(0, -1).join(".");
    const ext = audioFile.name.split(".").pop();
    return (
      <>
        <div className="flex-center">
          <span className="inline-block overflow-hidden text-ellipsis max-w-32">{name}</span>
          <span>.{ext}</span>
        </div>
        <div className="i-solar:refresh-square-outline ml-4 text-xl"></div>
      </>
    );
  };

  return (
    <>
      <div>
        {/* 音频上传 */}
        <label className="flex-center px-2 py-1 text-emerald-800 dark:text-white hover:text-emerald-500 dark:hover:text-emerald-300">
          <div className="w-full h-6 whitespace-nowrap flex-between">{formatAudioName()}</div>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleAudioUpload}
          />
        </label>

        {/* 分割线 */}
        <div className="h-0.5 w-full border-b-2 border-dotted border-stone-600 py-1"></div>

        {/* 可视化元素 */}
        <div className="py-4 flex flex-col space-y-4">
          <AudioSvgGroup />
        </div>
      </div>
    </>
  );
};

export default AudioUploader;
