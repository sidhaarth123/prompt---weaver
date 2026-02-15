import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | AI Instagram Post Generator',
    description: 'User dashboard',
};

export default function DashboardPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Dashboard placeholder</p>
        </div>
    );
}
