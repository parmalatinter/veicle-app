"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../src/providers/AuthProvider";
import { Box, Typography, Paper } from "@mui/material";

export default function Home() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    ようこそ {user.name || user.email} さん
                </Typography>
                <Typography variant="body1">
                    Vehicle Appへようこそ。このアプリケーションでは車両管理が行えます。
                </Typography>
            </Paper>
        </Box>
    );
}
