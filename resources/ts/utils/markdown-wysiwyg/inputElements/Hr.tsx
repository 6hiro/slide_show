import { handleFocus } from './event/onFocus';



type Props = {
    id: string;
}
const Hr = (props: Props) => {
    return (
        <div className='slide_separator' role="separator" onClick={()=>{handleFocus(props.id)}}>
            <span className='slide_separator_dot' ></span>
            <span className='slide_separator_dot' ></span>
            <span className='slide_separator_dot' ></span>
        </div>
    )
};

export default Hr;