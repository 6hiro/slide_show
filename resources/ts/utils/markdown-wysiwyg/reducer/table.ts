import { createNewData, createNewRow } from "../../../hooks/useTable";
import { generateUid } from "../../uid";
import { TABLE, TABLE_CELL } from "../inputElements/table/type";



export const tableReducer = (
    table: TABLE,
    action: {
        type: "CHANGE_CELL_TEXT" | "INSERT_COLUMN"| "DELETE_COLUMN" | "INSERT_ROW"  | "DELETE_ROW" | "RE_SIZE_COL" | "CHANGE_TEXT_ALIGN",
        payload: {
            id: string,  // action が実行された Cell の id
            rowIndex: number, // action が実行された Cell の行の Index
            colIndex: number, // action が実行された Cell の列の Index
            width: number, 
            newData?: TABLE_CELL,
            direction: string, // 行や列を挿入・削除する方向
            textAlign: "start" | "center" | "end",
        }
    }, 
) => {
    switch(action.type) {
        case "CHANGE_TEXT_ALIGN":
            let textAlignChangedTable = {...table};
            const textAlignSign = {"start": ":-", "center": "-", "end": "-:"}
            //  1 行目の 指定の列(colIndex)の textAlign を変更
            // console.log(action.payload.colIndex)
            // textAlignChangedTable.rows[0].data[action.payload.colIndex].text = textAlignSign[action.payload.textAlign];

            const newRows = textAlignChangedTable.rows.map((row, i) => {
                if(i===0) row.data[action.payload.colIndex].text =  textAlignSign[action.payload.textAlign];
                
                row.data[action.payload.colIndex].textAlign =  action.payload.textAlign;
                return row
            })
            textAlignChangedTable.rows = newRows;

            return textAlignChangedTable;
        case "CHANGE_CELL_TEXT":
            const newData = action.payload.newData;
            if(newData){
                let cellChangedTable = {...table};
                cellChangedTable.rows = cellChangedTable.rows.map((row, i) => {
                    if(i ===  action.payload.rowIndex) {
                        row.data = row.data.map((cell) => {
                            if(cell.id ===  action.payload.id) {
                                cell.text = newData.text;
                                return cell;
                            }else{
                                return cell;
                            }
                        })
                        return row;
                    }else{
                        return row;
                    }
                });
                return cellChangedTable;
            }
            return table;
        case "INSERT_COLUMN":
            let columnInsertedTable = {...table};
            
            if((action.payload.direction === "left" ) || (action.payload.direction === "right")) {
                columnInsertedTable.rows = columnInsertedTable.rows.map((row, i) => {
                    if(action.payload.direction === "left"){
                        // colIndex が action.payload.colIndex の cell を各行に挿入
                        const newCell: TABLE_CELL = createNewData(
                                                        generateUid(), 
                                                        action.payload.colIndex, 
                                                        i===0 ? ":-" : "", // 1 行目は TextAlign
                                                        action.payload.colIndex, 
                                                        100, 
                                                        "start"
                                                    );

                        const newData = row.data
                                            .map((cell, i) => { // colIndex, order の変更
                                                if(cell.colIndex >= action.payload.colIndex){ // action.payload.colIndex 以降のCellを変更
                                                    cell.colIndex  += 1;
                                                    cell.order += 1;
                                                    return cell;
                                                }
                                                return cell;
                                            })
                                            // .splice(action.payload.colIndex, 0, newCell);
                        newData.splice(action.payload.colIndex, 0, newCell)
                        row.data = newData;
                    }else{
                        // colIndex が action.payload.colIndex+1 の cell を各行に挿入
                        const newCell: TABLE_CELL = createNewData(generateUid(), action.payload.colIndex+1, i===0 ? ":-" : "", action.payload.colIndex+1, 100, "start");
                        const newData = row.data
                                            .map((cell, i) => { // colIndex, order の変更
                                                if(cell.colIndex > action.payload.colIndex){ // がaction.payload.colIndexより左にあるCellを変更
                                                    cell.colIndex  += 1;
                                                    cell.order += 1;
                                                    return cell;
                                                }
                                                return cell;
                                            })
                        newData.splice(action.payload.colIndex+1, 0, newCell);
                        row.data = newData;
    
                    }
                    return row;
                });
            }

            return columnInsertedTable;
        case "INSERT_ROW":
            let rowInsertedTable = {...table};
            if((action.payload.direction === "top" ) || (action.payload.direction === "bottom")) {
                const newRows  = rowInsertedTable.rows.map((row, i) => {
                    if(action.payload.direction === "top"){
                        if(row.rowIndex >= action.payload.rowIndex){ // action を起こしたセルのある列以降の列の rowIndex と order を変更
                            row.rowIndex += 1;
                            row.order += 1;
                        }
                    }else{
                        if(row.rowIndex > action.payload.rowIndex){ // action を起こしたセルのある列より下の列の rowIndex と order を変更
                            row.rowIndex += 1;
                            row.order += 1;
                        }
                    }
                    return row;
                });


                (action.payload.direction === "top") 
                    ? newRows.splice(
                            action.payload.rowIndex, 
                            0, 
                            createNewRow(generateUid(), "", 100, action.payload.rowIndex, newRows[0].data.length)
                        )
                    : newRows.splice(
                            action.payload.rowIndex+1, 
                            0, 
                            createNewRow(generateUid(), "", 100, action.payload.rowIndex+1, newRows[0].data.length)
                        )
                rowInsertedTable.rows = newRows;
            }
            // console.log(rowInsertedTable);
            return rowInsertedTable;
        case "DELETE_ROW":
            let rowDeletedTable = {...table};
            rowDeletedTable.rows = rowDeletedTable
                                .rows
                                .filter(row => row.rowIndex !== action.payload.rowIndex) // 指定の列を削除
                                .map((row, i) => { // rowIndex の変更
                                    if(row.rowIndex > action.payload.rowIndex){
                                        row.rowIndex -= 1;
                                        row.order -= 1;
                                        return row;
                                    }
                                    return row;
                                });
            return rowDeletedTable;
        case "DELETE_COLUMN":
            let columnDeletedTable = {...table};

            for (let i = 0; i < columnDeletedTable.rows.length; i++) {
                const new_row = columnDeletedTable.rows[i].data
                                    .filter(cell => cell.colIndex !== action.payload.colIndex)
                                    .map((cell, i) => { // colIndex, order の変更
                                        if(cell.colIndex > action.payload.colIndex){
                                            cell.colIndex  -= 1;
                                            cell.order -= 1;
                                            return cell;
                                        }
                                        return cell;
                                    });
                // Update row
                columnDeletedTable.rows[i].data = new_row;
            }

            return columnDeletedTable;
        case "RE_SIZE_COL":
            let columnresizeedTable = {...table};
            // const new_width = action.payload.width
            // const colIndex = action.payload.colIndex

            // // Update width for all rows in the column
            // for (const row of columnresizeedTable.rows) {
            //     row.data[colIndex].width = new_width
            // }
            // columnresizeedTable.rows[0].data[colIndex].width = new_width
            return columnresizeedTable;
    }
}