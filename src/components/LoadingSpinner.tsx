import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
);

export default LoadingSpinner;
