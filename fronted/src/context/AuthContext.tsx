import { createContext, useContext, useState } from "react";

interface User {
    _id: string,
    name: string,
    email: string
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {

    const [user, setUser] = useState<User | null>(
        JSON.parse(localStorage.getItem("user") || "null")       
    );

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const login = (token: string, user: User) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setToken(token);
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, token, login, logout}}>
            {children}
        </AuthContext.Provider>
    );

};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if(!context)
        throw new Error("UseAuth must be inside AuthProvider");

    return context;
};