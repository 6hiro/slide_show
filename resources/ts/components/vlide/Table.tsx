type Props = {
    content?: string
}

const Table = (props: Props) => {
    const rows =  props?.content?.split("\n").filter(Boolean)

    const tableArray = rows 
        ? rows.map( (row) => {
            return row.split("|").map((cell) => cell.trim())
        }) 
        : []

    const TextAlignRegExp = /^(\:?-+\:?)$/;
    const isTextAlign = (cell: string) => cell.match(TextAlignRegExp);


    const hasThread = tableArray[1] ? tableArray[1].every(isTextAlign) : false;
    const theadArray = hasThread ? tableArray[0] : [];
    const tbodyArray = hasThread 
        ? tableArray.slice(2,) // thread がある場合
        : tableArray[0] && tableArray[0].every(isTextAlign)
            ? tableArray.slice(1,) // thread はないが、1行目に text-aligin の指示がある場合
            : tableArray;

    const getTextAlign = (cell: string): "start" | "end" | "center" => {
        if(cell.slice(0,1) === ":" && cell.slice(-1) === ":") {
            return "center"
        }else if(cell.slice(0,1) === ":" && cell.slice(-1) === "-") {
            return "start"
        }else if(cell.slice(0,1) === "-" && cell.slice(-1) === ":") {
            return "end"
        }else{
            return "center"
        }
    }

    // thread がある場合
    if( hasThread && tableArray[0].length === tableArray[1].length ) {
        return (
            <div className='slide_table_wrapper'>
                <table>
                    <thead>
                        <tr>
                            {theadArray.map((td, i) => {
                                return <td key={i+"td"} style={{textAlign: getTextAlign(tableArray[1][i])}} >
                                    {td}
                                </td>
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {tbodyArray.map((tr, i) => {

                            return <tr key={i+"tr"}>
                                {[...Array(tableArray[1].length)].map((_, j) => {
                                    if(tableArray[1].length < j+1) return null;
                                    // const textAlign: "start" | "end" | "center" = getTextAlign(tableArray[1][j])

                                    return <th key={j+"th"} style={{textAlign: getTextAlign(tableArray[1][j])}}>
                                        {tr[j]}
                                        {/* {tr[j] ? <DecoratedText content={tr[j]} /> : ""} */}
                                    </th>
                                })}
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        )
    }

    // thread はないが、1行目に text-aligin の指示がある場合
    if( tableArray[0] && tableArray[0].every(isTextAlign) ){
        return (
            <div className='slide_table_wrapper'>
                <table>
                    <tbody>
                        {tbodyArray.map((tr, i) => {
    
                            return <tr key={i+"th"}>
                                {[...Array(tableArray[0].length)].map((_, j) => {
                                    if(tableArray[0].length < j+1) return null
    
                                    return <th key={j+"th"} style={{textAlign: getTextAlign(tableArray[0][j])}}>
                                        {tr[j]}
                                        {/* {tr[j] ? <DecoratedText content={tr[j]} /> : ""} */}
                                    </th>
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

                                return <th key={j+"th"}>
                                    {tr[j]}
                                    {/* {tr[j] ? <DecoratedText content={tr[j]} /> : ""} */}
                                </th>
                            })}
                        </tr>
                    })}
                </tbody>
            </table>
        </div>

    )
};

export default Table;