// https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalUtils.ts#L498
export function generateUid() {
    return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "")
        .substring(0, 5);
}