import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

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

    if (loading) return <div>Loading...</div>;
    if (!profile || profile.role !== requiredRole) return null;

    return <>{children}</>;
}

export default WithRoleCheck;
