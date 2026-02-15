import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Generator | AI Instagram Post Generator',
    description: 'Generate posts',
};

export default function GeneratorPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl font-bold">Post Generator</h1>
            <p>Generator tool placeholder</p>
        </div>
    );
}
