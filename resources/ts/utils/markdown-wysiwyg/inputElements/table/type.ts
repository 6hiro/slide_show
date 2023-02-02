export type TABLE = {
    id: string;
    name: string;
    rows: TABLE_ROW[];
};
export type TABLE_ROW = {
    id: string;    
    rowIndex: number;
    order: number;
    data: TABLE_CELL[];
};

export type TABLE_CELL = {
    id: string;    
    colIndex: number;
    text: string;
    order: number; // colIndex と同値なので削除?
    width: number;
    textAlign: "start" | "center" | "end";
};