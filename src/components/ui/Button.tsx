import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    isLoading?: boolean;
}

export const Button = ({ children, variant = 'primary', isLoading, className = '', ...props }: ButtonProps) => {
    const baseStyles = "py-3 px-4 rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/25",
        secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700",
        outline: "border-2 border-slate-700 hover:border-slate-600 text-slate-200 hover:bg-slate-800",
        ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin w-5 h-5" />}
            {children}
        </button>
    );
};
