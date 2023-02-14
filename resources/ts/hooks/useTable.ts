import { useCallback, useEffect, useState } from "react";

import { TABLE, TABLE_CELL, TABLE_ROW } from "../utils/markdown-wysiwyg/inputElements/table/type";
import { tableReducer } from "../utils/markdown-wysiwyg/reducer/table";
import { isTextAlign } from "../utils/table";
import { generateUid } from "../utils/uid";



export type TABLE_ACTIONS= {
    changeTextAlign: (id: string, colIndex: number, textAlign: "start" | "center" | "end") => void,
    changeCellText: (id: string, rowIndex: number, colIndex: number, text: string, order: number, width: number, textAlign: "start" | "center" | "end") => void;
    insertRow: (id: string, rowIndex: number, colIndex: number, direction: string) => void;
    insertColumn: (id: string, rowIndex: number, colIndex: number, direction: string) => void;
    deleteRow: (id: string, rowIndex: number, colIndex: number) => void;
    deleteColumn: (id: string, rowIndex: number, colIndex: number) => void
};


export const useTable = (
    id: string, 
    type: string, 
    content: string,
    changeContent: (id: string, content: string) => void,
    deleteBlock: (id: string) => void
) =>  {
    const initialTable = convertToTable(id, type, content)
    const [table, setTable] = useState(initialTable);
    // const [tableName, setTableName] = useState(table.name);

    const changeTextAlign = useCallback((id: string, colIndex: number, textAlign: "start" | "center" | "end") => {
        const newTable = tableReducer(
            table, 
            {
                type: "CHANGE_TEXT_ALIGN", 
                payload: {id, rowIndex: 0, colIndex, width: 100, direction: "", textAlign}
            }
        );
        newTable && setTable(newTable);

    },[table]);

    const changeCellText = useCallback((id: string, rowIndex: number, colIndex: number, text: string, order: number, width: number, textAlign: "start" | "center" | "end") => {
        const newDAata = createNewData(id, colIndex, text, order, width, textAlign)
        const newTable = tableReducer(
            table, 
            {
                type: "CHANGE_CELL_TEXT", 
                payload: {id, rowIndex, colIndex, width: 100, newData: newDAata, direction: "", textAlign: "start"}
            }
        );
        newTable && setTable(newTable);

    },[table]);
    const deleteRow = useCallback((id: string, rowIndex: number, colIndex: number) => {
        const newTable = tableReducer(
            table, 
            {
                type: "DELETE_ROW", 
                payload: {id, rowIndex, colIndex, width: 0, newData: undefined, direction: "", textAlign: "start"}
            }
        );
        if(newTable?.rows.length === 1 && isTextAlign(newTable.rows[0].data[0].text)) { // 1 行目は TextAlign
        // if(newTable?.rows.length === 0) { 
            // table を Editor 全体の State から削除
            deleteBlock(table.id)
        }else{
            newTable && setTable(newTable);
        }
    },[table]);
    const deleteColumn = useCallback((id: string, rowIndex: number, colIndex: number) => {
        const newTable = tableReducer(
            table, 
            {
                type: "DELETE_COLUMN", 
                payload: {id, rowIndex, colIndex, width: 0, newData: undefined, direction: "", textAlign: "start"}
            }
        );
        if(newTable?.rows[0].data.length === 0) {
            // table を Editor 全体の State から削除
            deleteBlock(table.id)
        }else{
            newTable && setTable(newTable);
        }
    },[table]);

    const insertRow = useCallback((id: string, rowIndex: number, colIndex: number, direction: string) => {
        const newTable = tableReducer(table, {
            type: "INSERT_ROW",
            payload: {id, colIndex, rowIndex, width: 0, newData: undefined, direction: direction, textAlign: "start"}
        });
        newTable && setTable(newTable);
    },[table]);

    const insertColumn = useCallback((id: string, rowIndex: number, colIndex: number, direction: string) => {
        const newTable = tableReducer(table, {
            type: "INSERT_COLUMN",
            payload: {id, colIndex, rowIndex, width: 0, newData: undefined, direction: direction, textAlign: "start"}
        });
        newTable && setTable(newTable);
    },[table]);


    useEffect(() => {
        // table 変更時に Editor 全体の State を変更
        const newContent = convertToContent(table);
        changeContent(table.id, newContent)
    }, [table])

    const actions = {
        changeTextAlign,
        changeCellText,
        insertRow,
        insertColumn,
        deleteRow,
        deleteColumn,
    };
    return [
        table,
        // tableName,
        actions
    ]  as const;
};

export const createNewData = ( id: string, colIndex: number, text: string, order: number, width: number, textAlign: "start" | "center" | "end" ) => {
    return { id, colIndex, text, order, width, textAlign };
};
export const createNewRow = ( id: string, text: string, width: number, rowIndex: number, rowLength: number, textAligns?: ("start" | "center" | "end")[] ): TABLE_ROW => {
    const newData = [] as TABLE_CELL[];
    for (let i = 0; i < rowLength; i++) {
        ( textAligns && (textAligns.length === rowLength) )
            ?
                newData.push(
                    createNewData( generateUid(), i, text, i, width, textAligns[i] )
                )
            : 
                newData.push(
                    createNewData( generateUid(), i, text, i, width, "start" )
                )
    }
    return {
        id: id,
        rowIndex: rowIndex,
        order: rowIndex,
        data:  newData
    };
};



const convertToTable = (id: string, type: string, content: string): TABLE => {
    const defaultRows: TABLE_ROW[] = [
        {
            id: generateUid(),
            rowIndex: 0, 
            order: 0, 
            data: [
                {id: generateUid(), colIndex: 0, text: ":-", order: 0, width: 100, textAlign: "start"},
                {id: generateUid(), colIndex: 1, text: ":-", order: 1, width: 100, textAlign: "start"},
            ]
        },
        {
            id: generateUid(),
            rowIndex: 1, 
            order: 1, 
            data: [
                {id: generateUid(), colIndex: 0, text: "", order: 0, width: 100, textAlign: "start"},
                {id: generateUid(), colIndex: 1, text: "", order: 1, width: 100, textAlign: "start"},
            ]
        },
        {
            id: generateUid(),
            rowIndex: 2, 
            order: 2, 
            data: [
                {id: generateUid(), colIndex: 0, text: "", order: 0, width: 100, textAlign: "start"},
                {id: generateUid(), colIndex: 1, text: "", order: 1, width: 100, textAlign: "start"},
            ]
        },
    ];
    
    // const TextAlignRegExp = /^(\:?-+\:?)$/;
    // const isTextAlign = (cell: string) => cell.match(TextAlignRegExp);
    const rows: TABLE_ROW[] =  content
        .split("\n")
        .filter(Boolean)
        .map( (row, i) => {
            return {
                id: generateUid(),
                rowIndex: i, 
                order: i, 
                data: row.split("|").map((cell, j) => {
                         return {id: generateUid(), colIndex: j, text: cell.replace(/\u0001/g, "\n"), order: j, width: 100, textAlign: "start"};
                     })
            };
        });
    return {
        id: id,
        name: type.split(":")[1] ? type.split(":")[1] : "",
        rows: rows.length ? rows : defaultRows
    };
};

// DB に保存するデータ構造に変換
const convertToContent= (table: TABLE): string => {
    // table: {
    //     rows:[
    //         {data: [{text: "00", ...}, [{text: "01", ...}], ...},
    //         {data: [{text: "10", ...}, [{text: "11", ...}], ...},
    //     ], 
    //     ...} 
    // ---> "00|01\n10|11"
    let content = "";
    table.rows.map((row, i) => {
        content += (i !== 0) ?  "\n" : "";

        row.data.map((cell, j)=> {
            content += (j !== 0) ?  "|" : "";
            // 改行コードを \u0001 に変換　（改行コードは何列か表すために使うため、セル内の改行は \u0001 で表す）
            content += cell.text
                .replace(/(\r\n){3,}|\r{3,}|\n{3,}/g, '\n\n')
                .replace(/\r?\n/g, "\u0001");
        })
    })

    return content;
};
