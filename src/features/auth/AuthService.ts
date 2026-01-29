import api from '../../services/api';
import type { LoginRequest, LoginResponse } from './types';

const AuthService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', credentials, { baseURL: '/' });
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

export default AuthService;
