import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    CLOSE_MODAL: "CLOSE_MODAL"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: ""
    });
    const history = useHistory();

    // useEffect(() => {
    //     auth.getLoggedIn();
    // }, [auth]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: payload.errorMessage
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: payload.errorMessage
                })
            }
            case AuthActionType.LOGIN_FAILURE: {
                    return setAuth({
                        user: payload.user,
                        loggedIn: false,
                        errorMessage: payload.errorMessage
                    })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: payload.errorMessage
                }) 
            }
            case AuthActionType.CLOSE_MODAL: {
                return setAuth({
                    errorMessage: ""
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try{
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        errorMessage: auth.errorMessage
                    }
                });
            }
        }catch(e){
            console.error(e);
        }
    }

    auth.registerUser = async function(userData, store) {
        try{
            const response = await api.registerUser(userData);  
            if (response.status === 201) {
                authReducer({
                    type: AuthActionType.LOGIN_FAILURE,
                    payload: {
                        loggedIn: false,
                        user: null,
                        errorMessage: response.data.errorMessage
                    }
                })
            }    
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        errorMessage: ""
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }catch(error){
            console.log(error);
        }

    }

    auth.loginUser = async function(userData, store){
        try{
            const response = await api.loginUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        errorMessage: response.data.errorMessage
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
            if (response.status === 201) {
                console.log("plz : " + response.data.errorMessage)
                authReducer({
                    type: AuthActionType.LOGIN_FAILURE,
                    payload: {
                        loggedIn: false,
                        user: null,
                        errorMessage: response.data.errorMessage
                    }
                })
            }   

        }catch(e){
            console.error(e);
            
        }
    }

    auth.logoutUser = async function(){
        try{
            const response = await api.logoutUser();
            if(response.status === 200){
                authReducer({
                    type: AuthActionType.LOGOUT_USER,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        errorMessage: response.data.errorMessage
                    }
                })
                history.push("/");
            }
        }catch(error){
            console.error(error);
        }
    }

    auth.closeModal = async function(){
        authReducer({
            type: AuthActionType.CLOSE_MODAL
        })
    }
    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };