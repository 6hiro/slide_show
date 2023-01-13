import axios from "../libs/axios";



export const uploadAsyncImage = async(
    url: string,
    uploadData: FormData,
    processing: React.MutableRefObject<boolean>,
    onSuccess: (res: any) => void,
    onError: (err: any) => void
) => {
    await axios
        .post(
            `${url}`, 
            uploadData,
            {
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "Accept": "application/json",
                    'content-type': 'multipart/form-data',
                },
                withCredentials: true
            }
        )
        .then(res => {
            onSuccess(res);
        })
        .catch(err => {
            onError(err);
        })
        .finally(()=>{
            processing.current = false;
        });
};

export const deleteAsyncImage = async(
    url: string,
    processing: React.MutableRefObject<boolean>,
    onSuccess: (res: any) => void,
    onError: (err: any) => void
) => {
    await axios
    .delete(url)
    .then(res => {
        onSuccess(res)
    })
    .catch((err) => {
        onError(err)
    })
    .finally(()=>{
        processing.current = false;
    });
};

export const fetchAsyncUserImages = async (
    userId: string,
    onSuccess: Function,
    onError: Function
) => {
    axios
        .get(`/api/v1/user/${userId}/images`)
        .then((res) => {
            onSuccess(res);
        })
        .catch((err) => {
            onError(err);
        });
};