export type USER = {
    id: string;
    name: string;
    nick_name: string;
    email_verified_at: string;
    // email: string;
    isFollowed: boolean;
    followers: number;
    following:  number;
    count_followers: number;
    count_followings: number;
    // isFollowedBy: boolean;
    description?: string;
    count_vlides: number;
};

// interface User {
//       id: string;
//       name: string;
//       nick_name: string;
//       email_verified_at: string;
//       count_followers: number;
//       count_followings: number;
//       isFollowedBy: boolean;
    
//   }