import { createContext, useState } from "react";
import { registerUserService } from "../services/authService";

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState({
        register: false,
        login: false
    });

    async function registerUser(data) {
        setLoading(prev => ({ ...prev, register: true }))
        try {
            await registerUserService(data)
        } catch (error) {
            throw error
        } finally {
            setLoading(prev => ({ ...prev, register: false }))
        }
    }
    

    return (
        <AuthContext.Provider value={{user, setUser, registerUser, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;