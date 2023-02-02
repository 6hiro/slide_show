// import Cell from './Cell';
import { TABLE_ROW } from './type';



type Props = {
    row: TABLE_ROW;
};

const TableHeader = (props: Props) => {
    return (
        <thead className="table_head">
            <tr className="table_head__row">
                {props.row.data.map((data, index) => {
                    return (
                        <th className="table_head__row__header">
                            {/* <Cell data={data} key={index} index={index} /> */}
                        </th>
                    )
                })}
            </tr>
        </thead>
    )
};

export default TableHeader;