import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { RoleBasedRedirect } from '../RoleBasedRedirect';
import { MemoryRouter } from 'react-router-dom';
import * as reduxHooks from '../../hooks/redux';

// Mock useAppSelector
vi.mock('../../hooks/redux', () => ({
    useAppSelector: vi.fn(),
}));

// Mock Navigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual as any,
        Navigate: (props: any) => {
            mockedNavigate(props.to);
            return <div>Redirected to {props.to}</div>;
        }
    };
});

describe('RoleBasedRedirect', () => {
    it('redirects to login if not authenticated (no user)', () => {
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({ user: null });

        render(
            <MemoryRouter>
                <RoleBasedRedirect />
            </MemoryRouter>
        );

        expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });

    it('redirects to dashboard for GESTIONNAIRE_LOGISTIQUE', () => {
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
            user: { roles: ['ROLE_GESTIONNAIRE_LOGISTIQUE'] }
        });

        render(
            <MemoryRouter>
                <RoleBasedRedirect />
            </MemoryRouter>
        );

        expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
    });

    it('redirects to client dashboard for CLIENT_EXPEDITEUR', () => {
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
            user: { roles: ['ROLE_CLIENT_EXPEDITEUR'] }
        });

        render(
            <MemoryRouter>
                <RoleBasedRedirect />
            </MemoryRouter>
        );

        expect(mockedNavigate).toHaveBeenCalledWith('/client/dashboard');
    });

    it('redirects to livreur dashboard for LIVREUR', () => {
        vi.spyOn(reduxHooks, 'useAppSelector').mockReturnValue({
            user: { roles: ['ROLE_LIVREUR'] }
        });

        render(
            <MemoryRouter>
                <RoleBasedRedirect />
            </MemoryRouter>
        );

        expect(mockedNavigate).toHaveBeenCalledWith('/livreur/dashboard');
    });
});
