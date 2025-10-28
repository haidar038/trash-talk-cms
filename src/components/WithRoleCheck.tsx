import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import LoadingSpinner from "./LoadingSpinner";

interface WithRoleCheckProps {
    requiredRole: "admin" | "user";
    children: React.ReactNode;
}

export function WithRoleCheck({ requiredRole, children }: WithRoleCheckProps) {
    const { profile, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!profile || profile.role !== requiredRole)) {
            navigate("/");
        }
    }, [profile, loading, requiredRole, navigate]);

    if (loading) return <LoadingSpinner />;
    if (!profile || profile.role !== requiredRole) return null;

    return <>{children}</>;
}

export default WithRoleCheck;
