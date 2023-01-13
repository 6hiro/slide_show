// import { Dispatch, SetStateAction } from "react";
// import axios from "../libs/axios";

// ワード検索時, タグ検索時に利用
// export const fetchAsyncRankData = async (
//     url:string,
//     setData: Dispatch<SetStateAction<any[] | undefined>>,
//     setIsLoadingContents: Dispatch<SetStateAction<boolean>>,

// ) => {
//     setIsLoadingContents(true);

//     axios
//         .get(url)
//         .then((res) => {
//             setData(res.data.data);
//         })
//         .catch((error) => {})
//         .finally(() => {
//             setIsLoadingContents(false);
//         });
// };

// export const fetchAsyncLatestData = async (
//     url:string,
//     setData: Dispatch<SetStateAction<any[] | undefined>>,
//     setNextPageLink: Dispatch<SetStateAction<string | undefined>>,
//     setIsLoadingContents: Dispatch<SetStateAction<boolean>>,
// ) => {
//     setIsLoadingContents(true);
    
//     axios
//         .get(url)
//         .then((res) => {
//             setNextPageLink(res.data.next_page_link);
//             setData(res.data.data);
//         })
//         .catch((error) => {})
//         .finally(() => {
//             setIsLoadingContents(false);
//         });
// };