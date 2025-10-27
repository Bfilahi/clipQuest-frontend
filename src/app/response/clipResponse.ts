import { UserResponse } from "./userResponse";
import { VideoLikeResponse } from "./videoLikeResponse";

export interface ClipResponse{
    id: number,
    title: string,
    description: string,
    pathFile: string,
    cloudinaryPublicId: string,
    thumbnailUrl: string,
    createdDate: Date,
    user: UserResponse,
    videoLikeResponse: VideoLikeResponse,
    views: number
}