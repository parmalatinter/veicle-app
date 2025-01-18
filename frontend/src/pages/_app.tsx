import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "../contexts/AuthContext";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </ThemeProvider>
    );
}
