import { useContext, useState } from 'react';

import { ToastNotificationsContext } from '../../hooks/useToastNotifications';
import AddClipForm from './AddClipForm';
import { useClip } from '../../hooks/useClip';
import { generateUid } from '../../utils/uid';



type Props = {
    toggleForm: Function;
};

const NewClipForm = (props: Props) => {

    const { 
        text, 
        setText,
        create,
    } = useClip();
    const [_, setToastNotifications] = useContext(ToastNotificationsContext);


    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);

    const addClip = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();

        if(loading) return;

        setLoading(true);

        const data = {
            id: "",
            content: text,
            quote: "",
        }
        create(data);
        
        setLoading(false);
    };

    return (
        <div className=""  style={{ minWidth: "300px", maxWidth: "400px", margin: "40px auto 0"}}>
            <AddClipForm 
                quote=""
                text={text}
                setText={setText}
                image={image}
                setImage={setImage}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                addClip={addClip}
                // placeholder="ひとこと。"
                // button?: string;
                autoFocus={true}
            />
        </div>
    )
};

export default NewClipForm;