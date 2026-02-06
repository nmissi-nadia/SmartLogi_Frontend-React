import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../LoginPage';
import { MemoryRouter } from 'react-router-dom';
import * as reduxHooks from '../../hooks/redux';
import AuthService from '../../features/auth/AuthService';

// Mock Redux
const mockDispatch = vi.fn();
vi.mock('../../hooks/redux', () => ({
    useAppDispatch: () => mockDispatch,
    useAppSelector: vi.fn(),
}));

// Mock AuthService
vi.mock('../../features/auth/AuthService', () => ({
    default: {
        login: vi.fn(),
    },
}));

// Mock useNavigate
const mockedNavigate = vi.fn();
// Mock Navigate component just in case
const mockedRedirect = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as any,
        useNavigate: () => mockedNavigate,
        Navigate: (props: any) => {
            mockedRedirect(props.to);
            return null;
        }
    };
});

describe('LoginPage Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders login form and handles submission', async () => {
        (reduxHooks.useAppSelector as any).mockReturnValue({ loading: false, error: null });
        (AuthService.login as any).mockResolvedValue({ token: 'fake-token', user: { id: 1, roles: ['ROLE_GESTIONNAIRE_LOGISTIQUE'] } });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        // Check if title is present
        expect(screen.getByText('SmartLogi')).toBeInTheDocument();

        // Fill form
        const usernameInput = screen.getByPlaceholderText("Nom d'utilisateur");
        const passwordInput = screen.getByPlaceholderText("Mot de passe");

        fireEvent.change(usernameInput, { target: { value: 'admin' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });

        const submitButton = screen.getByRole('button', { name: /se connecter/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(AuthService.login).toHaveBeenCalledWith({ username: 'admin', password: 'password' });
        });

        // Verify navigation
        await waitFor(() => {
            expect(mockedNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('displays error message on login failure', async () => {
        (reduxHooks.useAppSelector as any).mockReturnValue({ loading: false, error: 'Invalid credentials' });

        // Note: In a real integration test with a real store, the error would appear after dispatch.
        // Since we are mocking useSelector, we might need to change the mock return value during the test or simulate it.
        // However, usually we test that IF the state has error, IT IS DISPLAYED.

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
});
