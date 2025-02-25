export const getAudioBuffer = async (audio: File) => {
  const audioContext = new AudioContext();
  const buffer = await audio.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(buffer);
  return audioBuffer;
};

export const extractSamples = (buffer: AudioBuffer, time: number, fftSize: number) => {
  const allSamples = buffer.getChannelData(0);

  const percentage = time / buffer.duration;
  const startIdx = Math.floor(allSamples.length * percentage);
  const endIdx = startIdx + fftSize;

  let samples = allSamples.slice(startIdx, endIdx);
  const delta = samples.length - fftSize;
  if (delta < 0) {
    samples = new Float32Array(fftSize).fill(0);
  }

  return samples;
};
