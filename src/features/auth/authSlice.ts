import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { parseRoles } from '../../utils/authUtils';

interface User {
    username: string;
    roles: string[];
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const token = localStorage.getItem('token');
let initialUser = null;

if (token) {
    try {
        const decoded: any = jwtDecode(token);
        // Use the helper here too
        const roles = parseRoles(decoded);
        // 'sub' is standard for username
        if (decoded.sub) {
            initialUser = { username: decoded.sub, roles };
        }
    } catch (e) {
        console.error("Invalid token", e);
        localStorage.removeItem('token');
    }
}

const initialState: AuthState = {
    user: initialUser,
    token: token || null,
    isAuthenticated: !!initialUser,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
            state.loading = false;
            state.token = action.payload.token;
            localStorage.setItem('token', action.payload.token);

            try {
                const decoded: any = jwtDecode(action.payload.token);
                // Use the helper to ensure we always get string[]
                const roles = parseRoles(decoded);
                state.user = { username: decoded.sub, roles };
                state.isAuthenticated = true;
                state.error = null;
            } catch (e) {
                state.error = "Invalid token received";
                state.isAuthenticated = false;
            }
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
