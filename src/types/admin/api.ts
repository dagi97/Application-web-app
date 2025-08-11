import { User } from "./User";

export interface GetAllUsersData {
  users: User[];
  total_count: number;
  page: number;
  limit: number;
}

export interface ApiSuccessResponse {
  success: boolean;
  data: GetAllUsersData;
  message: string;
}

export interface GetUserByIdResponse{
  success: boolean;
  data: {
    id: string;
    full_name: string,
    email: string,
    role: string,
    profile_picture: string,
    is_active: boolean
  }
  message: string;
}

export interface GetAllUsersParams {
  page: number;
  limit: number
}
