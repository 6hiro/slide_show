export type USER = {
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
};

export type UPLOAD_ICON = {
    id: string;
    image: File;
};