export type NEW_BOOK = {
    title: string; 
    is_public: boolean;
};

export type UPLOAD_IMAGE = {
    id: string;
    image: File;
};

export type UPDATE_BOOK = {
    book_id: string;
    title: string; 
    overview: string;
    is_public: boolean;
    book_type: string;
};

export type BOOK = {
    id: string;
    title :string
    overview : string;
    is_public: boolean;
    book_type: string;
    img_file_name: string;
    pages : PAGE[];
    is_got: boolean;
    is_admitted: boolean;
    count_tickets: number;
    published_at : string;
    updated_at :string
    user: {id: string; name: string; nick_name: string; file_name: string;};
};
// export interface PAGE { // Vlide
//     id: string;
//     title: string;
//     content: string;
//     is_public: boolean;
//     published_at: string;
//     isPageOf: boolean;
//     order: number;
// };
export interface PAGE {
    id: string; // vlide_id
    title: string;
    isPageOf: boolean;
    order: number;
};

export type TICKET_USER = {
    id: string;
    name: string;
    nick_name: string;
    email_verified_at: string;
    file_name: string;
    // email: string;
    isFollowed: boolean;
    followers: number;
    following:  number;
    count_followers: number;
    count_followings: number;
    description?: string;
    count_vlides: number;
    is_admitted: boolean;
};