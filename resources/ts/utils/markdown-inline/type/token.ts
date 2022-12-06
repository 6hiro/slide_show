export type Attribute = {
    attrName: string;
    attrValue: string;
};

export interface RootToken {
    id: number;
    elmType: "root";
    content?: string;
    // parent?: Token
    children: Token[];
    attributes?: Attribute[];
}

export interface Token {
    id: number;
    elmType: string;
    content?: string;
    // parent?: Token
    children: Token[];
    attributes?: Attribute[];
}

// export type MergedToken = {
//     id: number;
//     elmType: 'merged';
//     content: string;
//     parent: Token | MergedToken;
//     attributes?: Attribute[];
// };