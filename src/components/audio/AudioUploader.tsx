import { getAudioBuffer } from "@/libs/media";
import { useAudioStore } from "@/stores";

const DEFAULT_AUDIO = "/audio/Super Mario.mp3";
const TEXT_CLASS = "text-emerald-800 hover:text-emerald-500 dark:(text-white hover:text-emerald-300)";

const AudioUploader: React.FC = () => {
  const { audioFile, setAudioFile, setAudioBuffer } = useAudioStore();

  const parseAudio = async (file: File) => {
    setAudioFile(file);
    const buffer = await getAudioBuffer(file);
    setAudioBuffer(buffer);
  };

  const loadDefaultAudio = async () => {
    const response = await fetch(DEFAULT_AUDIO);
    const blob = await response.blob();

    const fileName = DEFAULT_AUDIO.split("/").pop();
    const file = new File([blob], fileName!);

    parseAudio(file);
  };

  const renderAudioComp = () => {
    if (!audioFile)
      return (
        <>
          <span className="lg:text-lg">Upload a File</span>
          <div className="i-line-md:uploading-loop text-2xl ml-4"></div>
        </>
      );

    // 避免文件名过长的情况
    const name = audioFile.name.split(".").slice(0, -1).join(".");
    const ext = audioFile.name.split(".").pop();
    return (
      <>
        <div className="flex-center">
          <span className="inline-block overflow-hidden text-ellipsis max-w-28">{name}</span>
          <span>.{ext}</span>
        </div>
        <div className="i-solar:refresh-square-outline ml-4 text-xl"></div>
      </>
    );
  };

  return (
    <div
      className="mb-8"
      max-lg="mb-3"
    >
      {/* 音频上传 */}
      <label className={`flex-center px-2 py-1 ${TEXT_CLASS}`}>
        <div className="w-full h-6 whitespace-nowrap flex-between">{renderAudioComp()}</div>
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              parseAudio(file);
            }
          }}
        />
      </label>

      {/* 分割线 */}
      <div className="h-0.5 w-full border-b-2 border-dotted border-stone-600 py-1 mb-1"></div>

      {!audioFile && (
        <button
          className={`text-xs ${TEXT_CLASS}`}
          onClick={loadDefaultAudio}
        >
          No local audio? Try the default here!
        </button>
      )}
    </div>
  );
};

export default AudioUploader;
