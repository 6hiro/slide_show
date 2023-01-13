//  tsconfig.json に "paths": {"*": ["./resouces/@types/*"]}, を追加
interface Window {
    instgrm?: { Embeds: { process: () => void } };
    twttr?: { widgets: { load: (src: string) => void } };
}