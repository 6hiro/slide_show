import { CONTENT_EDITOR_ACTIONS } from '../../../../hooks/useContentEditor';
import { useTable } from '../../../../hooks/useTable';
import { handleFocus } from '../event/onFocus';
// import TableHeader from './TableHeader';
import TableRow from './TableRow';



type Props = {
    id: string;
    content: string;
    type: string;
    actions: CONTENT_EDITOR_ACTIONS;
};

const Table = (props: Props) => {
    // DB content:string 
    // --convertToTable(id: string, type: string, content: string)--> initialTable:TABLE
    // setTable(tableReducer(action, payload)) ----> newTable: TABLE 
    // ----> action.changeContent(id:string, content:string)
    const [table, actions] = useTable(props.id, props.type, props.content, props.actions.changeContent, props.actions.deleteBlock);
    if(!table.rows.length) return null;
    
    return (
        <div className='table_element_wrapper'>
            <div className="table_container">
                {/* <input className="table_title user_input" placeholder="無題" value={tableName? tableName: ""}
                    onChange={(e) => {
                        setTableName(e.target.value.replace(/[?]/g, "").replace(/[\:]/g, ""));
                    }}
                /> */}
                <div className="table">
                    <table className="table_div">
                        {/* <TableHeader row={table.rows[0]} /> */}

                        <tbody onClick={()=>{handleFocus(props.id)}}>
                            {/* {table.rows.map((row, i) => { */}
                            {table.rows.slice(1,).map((row, i) => {
                                return (
                                    <TableRow 
                                        row={row} 
                                        key={i+"row"}
                                        actions={actions}
                                    />
                                )
                            })}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )
};

export default Table;