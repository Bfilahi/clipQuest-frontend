import { UserResponse } from "./userResponse";

export interface CommentResponse{
    id: number,
    comment: string,
    createdDate: Date,
    user: UserResponse
}