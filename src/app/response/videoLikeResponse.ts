import { LikeType } from "../enum/likeType";

export interface VideoLikeResponse{
    userLikeStatus: LikeType,
    likesCount: number,
    dislikesCount: number
}