import { SHOW_IMAGE } from '../../types/vlide';
import Image from './Image';



type Props = {
    imageGallery: SHOW_IMAGE[];
};

const ImageGallery = (props: Props) => {
    return (
        <div className='image_gallery_container'>
            <div className='image_gallery'>
                {props.imageGallery.map((image, i) => 
                    <Image
                        key={i} 
                        image={image} 
                    />
                )}
            </div>
        </div>
    )
};

export default ImageGallery;