import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-[#18181B] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                        <p className="text-slate-400 mb-8">
                            A premium experience encountered an unexpected error. Our architects have been notified.
                        </p>
                        <Button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Reload Application
                        </Button>
                        {import.meta.env.DEV && (
                            <div className="mt-8 p-4 bg-black/40 rounded-lg text-left overflow-auto max-h-40">
                                <p className="text-[10px] font-mono text-red-400 whitespace-pre-wrap">
                                    {this.state.error?.stack}
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
