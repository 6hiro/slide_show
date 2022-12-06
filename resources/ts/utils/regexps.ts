const USERNAME_PATTERN = /^[0-9a-zA-Z_]+$/;
const PASSWORD_PATTERN = /^[0-9a-zA-Z@$!%*?&]+$/;
const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEXP  = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/

const inlineRegexps = [
    // code RegExp
    { elmType: 'code', regexp: /`(.+?)`/ },
    //strong RegExp
    // デフォルトでは、Greedy（欲張り）なマッチ
    // 量指定子(+や*など)の直後に「?」を置くことで、可能な限り短い文字列のマッチを検出するようになる
    { elmType: 'strong', regexp: /\*\*(.+?)\*\*/ },
    // { elmType: 'strong', regexp: /__(.+?)__/ },
    // italic RegExp
    // { elmType: 'italic', regexp: /\*(.+?)\*/ },
    { elmType: 'italic', regexp: /_(.+?)_/ },
    // delete RegExp
    { elmType: 'del', regexp: /~~(.+?)~~/ },
    // br RegExp
    // { elmType: 'br', regexp: /(\n)/ },
    // image RegExp
    { elmType: 'img', regexp: /\!\[(.*)\]\(((https)?(\:\/\/).*)\)/},
    // { elmType: 'img', regexp: /\!\[(.*)\]\(((http)(?:s)?(\:\/\/).*)\)/},
    // link RegExp
    { elmType: 'link', regexp: /\[(.*)\]\(((https)?(\:\/\/).*)\)/ },
];

export {
    USERNAME_PATTERN,
    PASSWORD_PATTERN,
    PASSWORD_REGEXP,
    EMAIL_REGEXP,
    inlineRegexps
};