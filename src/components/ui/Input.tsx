import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    success?: boolean;
    label?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
    error,
    success,
    label,
    helperText,
    className = '',
    ...props
}, ref) => {
    const inputClasses = `input-field ${error ? 'input-error' : ''} ${success ? 'input-success' : ''} ${className}`;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                className={inputClasses}
                {...props}
            />
            {helperText && (
                <p className={`mt-1.5 text-sm ${error ? 'text-danger-600' : success ? 'text-success-600' : 'text-slate-500'}`}>
                    {helperText}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';
