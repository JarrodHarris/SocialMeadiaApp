import React from 'react'
import { createContext, useReducer } from "react";
import AuthReducer from "./AuthReducer"

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
    
    // user: {
    //     _id: "6406c4458b3b2190a03e5572",
    //     username:   "Crash",
    //     email: "bandicoot@gmail.com",
    //     profilePicture: "ana_icon.png",
    //     coverPicture: "",
    //     followers: [],
    //     followings: [],
    //     isAdmin: false,
    // },
    isFetching: false,
    error: false
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    React.useEffect(() => {
        localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user])

    return(
        <AuthContext.Provider value={{user:state.user,
            isFetching:state.isFetching,
            error:state.error,
            dispatch,
            }}>
                {children}
        </AuthContext.Provider>
    )
}