import { useEffect } from "react";

declare global {
    interface Window {
        puter?: {
            ai?: {
                chat: (prompt: string, image: string, options: { model: string }) => Promise<any>;
            };
        };
    }
}

const PuterProvider = () => {
    useEffect(() => {
        if (!window.puter) {
            const script = document.createElement("script");
            script.src = "https://js.puter.com/v2/";
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    return null;
};

export default PuterProvider;
