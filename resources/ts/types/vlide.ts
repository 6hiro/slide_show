export interface File extends Blob {
    readonly lastModified: number;
    readonly name: string;
};

export type UPLOAD_AUDIO = {
    id: string;
    audio: File;
};

export type SHOW_IMAGE = {
    id: string;
    url: string, 
    is_public: boolean
    vlides: VLIDE[];
};

export type UPLOAD_IMAGE = {
    id: string;
    image: File;
};

export type UPLOADED_IMAGE = {
    id: string, 
    url: string, 
    is_public: boolean
}; 

export type NEW_VLIDE = { 
    title: string; 
    tag_list: string[] | []; 
    is_public: boolean;
};

export interface UPDATE_VLIDE { 
    vlide_id:string, 
    title: string, 
    content: string, 
    tag_list: string[], 
    duration: number,
    is_public: boolean 
};

export interface VLIDE {
    id: string;
    title: string;
    content: string;
    duration: number;
    is_public: boolean;
    published_at: string;
    updated_at: string;
    count_clips: number;
    is_saved: boolean;
    count_saves: number;
    audio_file_name: string;
    header_file_name: string;
    tags: {
        id: string;
        name: string;
    }[];
    user: {id: string; name: string; nick_name: string; description: string; file_name: string;};
};

export type BLOGCARD = {
    og_title: string;
    og_image: string;
    title: string;
    og_site_name: string;
    og_description: string;
};