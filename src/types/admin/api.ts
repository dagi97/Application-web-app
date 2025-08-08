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

export interface GetAllUsersParams {
  page: number;
  limit: number
}
