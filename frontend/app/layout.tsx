"use client";

import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider, useAuth } from "../src/providers/AuthProvider";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
    },
});

function Header() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("ログアウトエラー:", error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Vehicle App
                </Typography>
                {user && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography>{user.email}</Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            ログアウト
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ja">
            <body>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AuthProvider>
                        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                            <Header />
                            <Container component="main" sx={{ flex: 1, py: 4 }}>
                                {children}
                            </Container>
                        </Box>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
