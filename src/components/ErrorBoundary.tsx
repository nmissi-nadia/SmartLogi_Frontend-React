import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center px-4">
                    <div className="max-w-2xl w-full text-center">
                        {/* Error Icon */}
                        <div className="mb-8 flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertTriangle className="text-red-600" size={48} />
                            </div>
                        </div>

                        {/* Message */}
                        <h1 className="text-4xl font-bold text-slate-900 mb-4">
                            Oups ! Une Erreur s'est Produite
                        </h1>
                        <p className="text-lg text-slate-600 mb-8">
                            Quelque chose s'est mal passé. Nous nous excusons pour le désagrément.
                        </p>

                        {/* Error Details (Development) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
                                <p className="text-sm font-mono text-red-800 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                variant="primary"
                                onClick={this.handleRefresh}
                                className="gap-2"
                            >
                                <RefreshCw size={20} />
                                Rafraîchir la Page
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={this.handleReset}
                                className="gap-2"
                            >
                                <Home size={20} />
                                Retour à l'Accueil
                            </Button>
                        </div>

                        {/* Help Text */}
                        <div className="mt-12 glass-card p-6">
                            <p className="text-sm text-slate-600">
                                Si le problème persiste, veuillez contacter le support technique.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
