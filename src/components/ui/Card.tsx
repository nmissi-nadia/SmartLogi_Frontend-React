import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    variant?: 'default' | 'glass' | 'hover' | 'gradient-primary' | 'gradient-accent' | 'gradient-success' | 'gradient-warning';
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
    children,
    variant = 'default',
    padding = 'md',
    className = ''
}: CardProps) => {
    const variants = {
        default: 'card',
        glass: 'glass-card',
        hover: 'card-hover',
        'gradient-primary': 'card card-gradient-primary',
        'gradient-accent': 'card card-gradient-accent',
        'gradient-success': 'card card-gradient-success',
        'gradient-warning': 'card card-gradient-warning'
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div className={`${variants[variant]} ${paddings[padding]} ${className}`}>
            {children}
        </div>
    );
};
