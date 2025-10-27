import { Authority } from "./authority";

export interface UserResponse{
    id: number,
    firstName: String,
    lastName: String,
    age: number,
    email: string,
    phoneNumber: string,
    profilePicture: string,
    authorities: Authority[]
}
