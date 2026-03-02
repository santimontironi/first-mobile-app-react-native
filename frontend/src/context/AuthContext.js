import { createContext, use, useEffect, useState } from "react";
import { registerUserService, loginUserService, confirmUserService, dashboardService } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState({
        register: false,
        login: false,
        confirm: false,
        dashboard: true
    });

    async function registerUser(data) {
        setLoading(prev => ({ ...prev, register: true }))
        try {
            const res = await registerUserService(data)
            return res.data
        } catch (error) {
            throw error
        } finally {
            setLoading(prev => ({ ...prev, register: false }))
        }
    }
    
    async function loginUser(data) {
        setLoading(prev => ({ ...prev, login: true }))
        try {
            const res = await loginUserService(data)

            await AsyncStorage.setItem("token", res.data.token)

            setUser(res.data.user)

            return res
            
        } catch (error) {
            throw error
        } finally {
            setLoading(prev => ({ ...prev, login: false }))
        }
    }

    async function confirmUser(data) {
        setLoading(prev => ({ ...prev, confirm: true }))
        try {
            const res = await confirmUserService(data)
            return res
        } catch (error) {
            throw error
        } finally {
            setLoading(prev => ({ ...prev, confirm: false }))
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try{
                const token = await AsyncStorage.getItem("token");
                if(token){
                    const res = await dashboardService(token);
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            }
            catch(error){
                setUser(null);
                throw error
            }
            finally{
                setLoading(prev => ({ ...prev, dashboard: false }))
            }
        }
        
        fetchUser();
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser, registerUser, loginUser, loading, confirmUser}}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;