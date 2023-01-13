const USERNAME_PATTERN = /^[0-9a-zA-Z_]+$/;
const PASSWORD_PATTERN = /^[0-9a-zA-Z@$!%*?&]+$/;
const PASSWORD_REGEXP = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const EMAIL_REGEXP  = /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/

// const urlRegExp = /^(https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/;
const urlRegExp = /^(https\:\/\/[\w!?/+\-_~=;:.,*&@#$%()'[\]]+)[^)\s]/;
const tagRegExp = /^(#[0-9a-zA-Z０-９ａ-ｚＡ-Ｚぁ-んァ-ヶｱ-ﾝﾞﾟ一-龠]+)$/;
const atRegExp = /^@[0-9a-zA-Z_]+$/;

// const slideBlockRegExp = /---(.*)\n([\s\S]*?)---(([0-9]?[0-9]:)?([0-9]?[0-9]:)?[0-9]?[0-9])\n?/gm; 
// const slideRegExp = /---(.*)\n([\s\S]*?)---(([0-9]?[0-9]:)?([0-9]?[0-9]:)?[0-9]?[0-9])\n?/; 
// 00:00:01
const slideBlockRegExp = /---(.*)\n([\s\S]*?)---(([0-9]{1,2}:)?[0-9]{1,2})\n?/gm; 
const slideRegExp = /---(.*)\n([\s\S]*?)---(([0-9]{1,2}:)?[0-9]{1,2})\n?/; 
// 00:01
// 01

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
    // url RegExp
    // { elmType: 'url', regexp: /(https?\:\/\/*)[^)\s]/ },
    { elmType: 'url', regexp: /(https\:\/\/[\w!?/+\-_~=;:.,*&@#$%()'[\]]+)[^)\s]/ },
    // { elmType: 'url', regexp: /[^(](https?\:\/\/.*)/ },
    // image RegExp
    { elmType: 'img', regexp: /\!\[(.*)\]\((https(\:\/\/)[\w!?/+\-_~=;:.,*&@#$%()'[\]]+)\)/},
    // { elmType: 'img', regexp: /\!\[(.*)\]\(((http)(?:s)?(\:\/\/).*)\)/},
    { elmType: 'linkCard', regexp: /\?\[(.*)\]\((https(\:\/\/)[\w!?/+\-_~=;:.,*&@#$%()'[\]]+)\)/ },
    { elmType: 'link', regexp: /\[(.*)\]\((https(\:\/\/)[\w!?/+\-_~=;:.,*&@#$%()'[\]]+)\)/ },
];

export {
    USERNAME_PATTERN,
    PASSWORD_PATTERN,
    PASSWORD_REGEXP,
    EMAIL_REGEXP,
    urlRegExp,
    tagRegExp,
    atRegExp,
    slideBlockRegExp,
    slideRegExp,
    inlineRegexps
};