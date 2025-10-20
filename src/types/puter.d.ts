interface PuterAI {
    chat: (prompt: string, image: string, options: { model: string }) => Promise<any>;
}

interface Puter {
    ai: PuterAI;
}

declare global {
    interface Window {
        puter?: Puter;
    }
}
