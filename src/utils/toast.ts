import toast from 'react-hot-toast';

// Toast configuration
const toastConfig = {
    duration: 4000,
    position: 'top-right' as const,
    style: {
        background: '#fff',
        color: '#1e293b',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        maxWidth: '500px',
    },
};

export const showToast = {
    success: (message: string) => {
        toast.success(message, {
            ...toastConfig,
            iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
            },
        });
    },

    error: (message: string) => {
        toast.error(message, {
            ...toastConfig,
            iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
            },
        });
    },

    loading: (message: string) => {
        return toast.loading(message, toastConfig);
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            toastConfig
        );
    },

    dismiss: (toastId?: string) => {
        toast.dismiss(toastId);
    },
};

export default showToast;
