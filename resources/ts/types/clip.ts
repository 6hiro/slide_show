export interface NEW_CLIP {
    id: string;
    content: string;
    quote: string;
};
export interface NEW_REPLY {
    id: string;
    content: string;
};
export interface CLIP {
    id: string;
    clip_type: string;
    content: string;
    quote:string;
    user: {id: string; name: string; nick_name: string; file_name: string;};
    img: string;
    created_at: string;
    is_liked: boolean;
    count_likes: number;
    // is_shared: boolean;
    count_replies: number;
    count_reclips: number;
    vlide_id: string | null;
    tags: {
        id: string;
        name: string;
    }[];
    parent?: {
        id: string;
        clip_type: string;
        content: string;
        quote:string;
        user: {id: string; name: string; nick_name: string; file_name: string;};
        img: string;
        created_at: string;
        is_liked: boolean;
        count_likes: number;
        // is_shared: boolean;
        count_replies: number;
        count_reclips: number;
        vlide_id: string | null;
        tags: {
            id: string;
            name: string;
        }[];
        parent?: {
            id: string;
            clip_type: string;
            content: string;
            quote:string;
            user: {id: string; name: string; nick_name: string; file_name: string;};
            img: string;
            created_at: string;
            is_liked: boolean;
            count_likes: number;
            // is_shared: boolean;
            count_replies: number;
            count_reclips: number;
            vlide_id: string | null;
            tags: {
                id: string;
                name: string;
            }[];
        };
    };
};
