import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    dot?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export const Badge = ({
    children,
    variant = 'neutral',
    dot = false,
    size = 'md',
    className = ''
}: BadgeProps) => {
    const variants = {
        primary: 'badge-primary',
        accent: 'badge-accent',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
        info: 'badge-info',
        neutral: 'badge-neutral'
    };

    const sizes = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-3 py-1',
        lg: 'text-sm px-4 py-1.5'
    };

    return (
        <span className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
            {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
};

// Status-specific badge component
interface StatusBadgeProps {
    status: 'CREE' | 'COLLECTE' | 'EN_STOCK' | 'EN_TRANSIT' | 'LIVRE' | 'RETOURNE';
    className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
    const statusMap = {
        CREE: { label: 'Créé', className: 'status-created' },
        COLLECTE: { label: 'Collecté', className: 'status-collected' },
        EN_STOCK: { label: 'En Stock', className: 'status-in-stock' },
        EN_TRANSIT: { label: 'En Transit', className: 'status-in-transit' },
        LIVRE: { label: 'Livré', className: 'status-delivered' },
        RETOURNE: { label: 'Retourné', className: 'status-returned' }
    };

    const config = statusMap[status] || statusMap.CREE;

    return (
        <span className={`badge ${config.className} ${className}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {config.label}
        </span>
    );
};
