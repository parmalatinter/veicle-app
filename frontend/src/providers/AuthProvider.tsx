"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import axios from "axios";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    name: string | null;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const { token } = parseCookies();
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`);
            setUser(response.data);
        } catch (error) {
            destroyCookie(null, "token");
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                email,
                password,
            });

            if (response.data.success) {
                const { access_token, user } = response.data.data;
                setCookie(null, "token", access_token, {
                    maxAge: 30 * 24 * 60 * 60,
                    path: "/",
                });

                axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
                setUser(user);
                router.replace("/");
            } else {
                throw new Error(response.data.message || "ログインに失敗しました");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                throw new Error(error.response.data.message || "ログインに失敗しました");
            }
            throw new Error("ログインに失敗しました");
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`);
            if (response.data.success) {
                destroyCookie(null, "token");
                delete axios.defaults.headers.common["Authorization"];
                setUser(null);
                router.replace("/login");
            }
        } catch (error) {
            console.error("ログアウトエラー:", error);
            destroyCookie(null, "token");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            router.replace("/login");
        }
    };

    return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
