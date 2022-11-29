// https://github.com/streamich/react-use/blob/master/src/useAudio.ts
import createHTMLMediaHook from './factory/createHTMLMediaHook';

const useAudio = createHTMLMediaHook<HTMLAudioElement>('audio');

export default useAudio;