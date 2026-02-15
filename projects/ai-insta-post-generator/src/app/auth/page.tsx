import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Auth | AI Instagram Post Generator',
    description: 'Authentication page',
};

export default function AuthPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl font-bold">Authentication</h1>
            <p>Login / Signup placeholder</p>
        </div>
    );
}
