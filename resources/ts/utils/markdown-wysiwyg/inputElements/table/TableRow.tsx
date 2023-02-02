import { TABLE_ACTIONS } from '../../../../hooks/useTable';
import Cell from './Cell';
import { TABLE_ROW } from './type';



type Props = {
    row: TABLE_ROW;
    actions: TABLE_ACTIONS;
};

const TableRow = (props: Props) => {
    return (
        <tr className="table_row">
            {props.row.data.map((data, index) => {
                return (
                    <td className="row_data" key={index}>
                        <Cell 
                            // key={data.colIndex} 
                            data={data} 
                            rowIndex={props.row.rowIndex}
                            index={index} 
                            actions={props.actions}
                        />
                    </td>
                )
            })}
            

        </tr>
    )
};

export default TableRow;