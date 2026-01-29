import type { InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon;
    label?: string;
    error?: string;
}

export const Input = ({ icon: Icon, label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-slate-300 ml-1">{label}</label>}
            <div className="relative flex items-center">
                {Icon && <Icon className="absolute left-3 text-slate-400 w-5 h-5" />}
                <input
                    className={`w-full bg-slate-900/50 border border-slate-700 rounded-xl py-3 px-4 ${Icon ? 'pl-10' : ''} 
          text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
        </div>
    );
};
