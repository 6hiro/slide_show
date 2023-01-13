export type Attribute = {
    attrName: string;
    attrValue: string;
};

export interface RootToken {
    id: number;
    elmType: "root";
    content?: string;
    children: Token[];
    attributes?: Attribute[];
}

export interface Token {
    id: number;
    elmType: string;
    content?: string;
    children: Token[];
    attributes?: Attribute[];
}