import { BiPlus } from 'react-icons/bi';



const NewPageButton = () => {
    return (
        <div className='add_page_button'>
            <div className="add_page_button__text">
                <BiPlus />
                <div>ページを追加</div>
            </div>
        </div>
    )
};

export default NewPageButton;