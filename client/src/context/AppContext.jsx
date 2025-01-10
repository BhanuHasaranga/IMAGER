import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const backendurl = import.meta.env.VITE_BACKEND_URL

    const navigate = useNavigate()

    const loadCreditData = async () => {
        try {
            const {data} = await axios.get(backendurl + '/api/user/credits', {headers: {token}})

            if (data.success) {
                console.log("data fetched successfully", data)
                setCredit(data.credits)
                setUser(data.user)
                console.log(data.credits, data.user)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error.message)
            toast.error(error.message)        
        }
    }

    const generateImage = async (prompt) => {
        try {
            const {data} = await axios.post(backendurl + '/api/image/generate-image', {prompt}, {headers: {token}})

            if (data.success) {
                loadCreditData()
                toast.success("Image Generated Successfully")
                return data.resultImage
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            loadCreditData()
            if(data.creditBalance === 0){
                navigate('/buy-credit')
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    }

    useEffect(() => {
        if(token){
            loadCreditData()
        }
    }, [token])

    const value = {
        user, 
        setUser, 
        showLogin, 
        setShowLogin, 
        backendurl,
        token, 
        setToken,
        credit, 
        setCredit,
        loadCreditData,
        logout,
        generateImage
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider