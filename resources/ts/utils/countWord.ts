export function countWord (str: string) {
    let len = 0;

    for (let i = 0; i < str.length; i++) {
        // 半角スペースからチルダまでを指定すると、その中に半角英数字および半角記号も含まれることになります
        (str[i].match(/[ -~]/)) ? len += 0.5 : len += 1;
    }
    return len;
}

export function cutWord (str: string, maxlength: number) {

    let len = 0;
    let word ="";

    let i = 0;
    while( (i < str.length && len < maxlength) ) {
        (str[i].match(/[ -~]/)) ? len += 0.5 : len += 1;
        word += str[i];
        i++;
    }
    return word;
}
