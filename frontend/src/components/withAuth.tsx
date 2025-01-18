import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function WithAuthComponent(props: P) {
        const { user, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && !user) {
                router.replace("/login");
            }
        }, [loading, user, router]);

        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <CircularProgress />
                </Box>
            );
        }

        if (!user) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
