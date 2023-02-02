export const TextAlignRegExp = /^(\:?-+\:?)$/;

export const isTextAlign = (cellText: string) => cellText.match(TextAlignRegExp);

export const getTextAlign = (cellText: string): "start" | "end" | "center" => {
    if(cellText.slice(0,1) === ":" && cellText.slice(-1) === ":") { // :-:, :--------:
        return "center"
    }else if(cellText.slice(0,1) === ":" && cellText.slice(-1) === "-") { // :-, :--------
        return "start"
    }else if(cellText.slice(0,1) === "-" && cellText.slice(-1) === ":") { // -:, --------:
        return "end"
    }else{
        return "center"
    }
};