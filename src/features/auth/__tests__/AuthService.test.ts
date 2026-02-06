import { describe, it, expect, vi, beforeEach } from 'vitest';
import AuthService from '../AuthService';
import api from '../../../services/api';

// Mock the api module
vi.mock('../../../services/api', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('AuthService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('login calls api.post with correct arguments and returns data', async () => {
        const mockCredentials = { username: 'testuser', password: 'password123' };
        const mockResponse = { data: { token: 'fake-token', user: { id: 1, username: 'testuser' } } };

        (api.post as any).mockResolvedValue(mockResponse);

        const result = await AuthService.login(mockCredentials);

        expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials, { baseURL: '/' });
        expect(result).toEqual(mockResponse.data);
    });

    it('logout removes token from localStorage', () => {
        localStorage.setItem('token', 'some-token');
        AuthService.logout();
        expect(localStorage.getItem('token')).toBeNull();
    });
});
