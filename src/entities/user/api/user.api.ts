import { apiClient } from '@/shared/api';
import { API_ENDPOINTS } from '@/shared/config';
import type { User, CreateUserDTO, UpdateUserDTO } from '@/entities/user';

export const userApi = {
  // 사용자 목록 조회
  fetchUserList: (): Promise<User[]> => {
    return apiClient.get<User[]>(API_ENDPOINTS.USERS);
  },

  // 사용자 상세 조회
  fetchUserDetail: (id: string): Promise<User> => {
    return apiClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  },

  // 사용자 생성
  createUser: (data: CreateUserDTO): Promise<User> => {
    return apiClient.post<User>(API_ENDPOINTS.USERS, data);
  },

  // 사용자 수정
  updateUser: (id: string, data: UpdateUserDTO): Promise<User> => {
    return apiClient.put<User>(`${API_ENDPOINTS.USERS}/${id}`, data);
  },

  // 사용자 삭제
  deleteUser: (id: string): Promise<void> => {
    return apiClient.delete<void>(`${API_ENDPOINTS.USERS}/${id}`);
  },
};
