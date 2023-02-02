import { DecoratedText } from "../../utils/markdown-inline/Render";
import { getTextAlign, isTextAlign } from "../../utils/table";

type Props = {
    content?: string
}

const Table = (props: Props) => {
    const rows =  props?.content?.split("\n").filter(Boolean)

    const tableArray = rows 
        ? rows.map( (row) => {
            return row.split("|").map((cell) => cell.trim())
        }) 
        : [];

    // const hasThread = tableArray[1] ? tableArray[1].every(isTextAlign) : false;
    // const theadArray = hasThread ? tableArray[0] : [];
    // const tbodyArray = hasThread 
    //     ? tableArray.slice(2,) // thread がある場合
    //     : tableArray[0] && tableArray[0].every(isTextAlign)
    //         ? tableArray.slice(1,) // thread はないが、1行目に text-aligin の指示がある場合
    //         : tableArray;

    const tbodyArray = ( tableArray[0] && tableArray[0].every(isTextAlign) )
                            ? tableArray.slice(1,) // thread はないが、1行目に text-aligin の指示がある場合
                            : tableArray;



    // // thread がある場合
    // if( hasThread && tableArray[0].length === tableArray[1].length ) {
    //     return (
    //         <div className='slide_table_wrapper'>
    //             <table>
    //                 <thead>
    //                     <th>
    //                         {theadArray.map((td, i) => {
    //                             return <td key={i+"td"} style={{textAlign: getTextAlign(tableArray[1][i])}} >
    //                                 {td}
    //                             </td>
    //                         })}
    //                     </th>
    //                 </thead>

    //                 <tbody>
    //                     {tbodyArray.map((tr, i) => {

    //                         return <tr key={i+"tr"}>
    //                             {[...Array(tableArray[1].length)].map((_, j) => {
    //                                 if(tableArray[1].length < j+1) return null;
    //                                 // const textAlign: "start" | "end" | "center" = getTextAlign(tableArray[1][j])

    //                                 return <td key={j+"th"} style={{textAlign: getTextAlign(tableArray[1][j])}}>
    //                                     {tr[j]}
    //                                     {/* {tr[j] ? <DecoratedText content={tr[j]} /> : ""} */}
    //                                 </td>
    //                             })}
    //                         </tr>
    //                     })}
    //                 </tbody>
    //             </table>
    //         </div>
    //     )
    // }

    // // thread はないが、1行目に text-aligin の指示がある場合
    if( tableArray[0] && tableArray[0].every(isTextAlign) ){
        return (
            <div className='slide_table_wrapper'>
                <table>
                    <tbody>
                        {tbodyArray.map((tr, i) => {
    
                            return <tr key={i+"th"}>
                                {[...Array(tableArray[0].length)].map((_, j) => {
                                    if(tableArray[0].length < j+1) return null
    
                                    return <td key={j+"th"} style={{textAlign: getTextAlign(tableArray[0][j])}}>
                                        {tr[j] 
                                            ?  <DecoratedText 
                                                    content={tr[j]
                                                        .replace(/\u0001/g, "\n")
                                                        // .replace(/(\r\n){3,}|\r{3,}|\n{3,}/g, '\n\n')
                                                    } 
                                                /> 
                                            : ""
                                        }
                                    </td>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )    
    }

    return (
        <div className='slide_table_wrapper'>
            <table>
                <tbody>
                    {tbodyArray.map((tr, i) => {

                        return <tr key={i+"tr"}>
                            {[...Array(tableArray[0].length)].map((_, j) => {
                                if(tableArray[0].length < j+1) return null

                                return (
                                    <td 
                                        key={j+"th"} 
                                        style={{overflowWrap: "break-word", whiteSpace: "pre-wrap"}}
                                    >
                                        {/* {tr[j].replace(/\u0001/g, "\n")}    */}
                                        {tr[j] 
                                            ?  <DecoratedText 
                                                    content={tr[j]
                                                        .replace(/\u0001/g, "\n")
                                                        // .replace(/(\r\n){3,}|\r{3,}|\n{3,}/g, '\n\n')
                                                    } 
                                                /> 
                                            : ""
                                        }
                                    </td>
                                )
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>

    )
};

export default Table;