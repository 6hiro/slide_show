import { Dispatch, SetStateAction } from "react";

import axios from "../libs/axios";



// fetchAsyncLatestData で　最初のデータをとる
// もし、next_page_link があれば,
// fetchAsyncMoreData でさらにデータをとることができる
export const fetchAsyncLatestData = async (
    url:string,
    setData: Dispatch<SetStateAction<any[] | undefined>>,
    setNextPageLink: Dispatch<SetStateAction<string | undefined>>,
    setIsLoadingContents: Dispatch<SetStateAction<boolean>> | null,
) => {
    setIsLoadingContents && setIsLoadingContents(true);
    setData([]);
    setNextPageLink('');

    await axios
        .get(url)
        .then((res) => {
            setNextPageLink(res.data.next_page_link);
            setData(res.data.data);
        })
        .catch((err) => {})
        .finally(() => {
            setIsLoadingContents && setIsLoadingContents(false);
        });
};

export const fetchAsyncMoreData = async(
    nextPageLink: string | undefined,
    setData: Dispatch<SetStateAction<any[] | undefined>>,
    setNextPageLink: Dispatch<SetStateAction<string | undefined>> | null,
) => {
    await axios
        .get(`${nextPageLink}`)
        .then((res) => {
            res.data.data && setData( (prev) => {
                if(prev){
                    return [...prev, ...res.data.data];
                }else{
                    return res.data.data;
                }
            });
            setNextPageLink && setNextPageLink(res.data.next_page_link ? res.data.next_page_link : "");
        })
        .catch((err) => {});
};


export const fetchAsyncRankData = async (
    url:string,
    setData: Dispatch<SetStateAction<any[] | undefined>>,
    setIsLoadingContents: Dispatch<SetStateAction<boolean>> | null,
) => {
    setIsLoadingContents && setIsLoadingContents(true);
    setData([]);

    await axios
        .get(url)
        .then((res) => {
            setData(res.data.data);
        })
        .catch((err) => {})
        .finally(() => {
            setIsLoadingContents && setIsLoadingContents(false);
        });
};