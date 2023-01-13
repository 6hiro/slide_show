import { BiDotsHorizontal, BiDotsVertical } from 'react-icons/bi';



const DotsButton = ({isVertical}: {isVertical:boolean}) => {
    return (
        <form className="dots_button">
            {isVertical ? <BiDotsVertical/> : <BiDotsHorizontal />}
        </form>
    )
};

export default DotsButton;