"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../src/providers/AuthProvider";
import { Box, Button, Container, TextField, Typography, Paper, Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import { parseCookies } from "cookies-next";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login, user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace("/");
        } else if (!loading && !user) {
            const { token } = parseCookies();
            if (!token) {
                router.replace("/login");
            }
        }
    }, [user, loading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : "ログインに失敗しました");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        ログイン
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="メールアドレス"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="パスワード"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                        />
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                            ログイン
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
