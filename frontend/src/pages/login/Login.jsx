import React from 'react'
import "./login.css"
import { loginCall } from "../../apiCalls"
import { AuthContext } from '../../context/AuthContext'
import { CircularProgress } from "@material-ui/core"
import { useNavigate } from "react-router-dom"

export default function Login() {

    const email = React.useRef();
    const password = React.useRef();
    
    const navigate = useNavigate();

    const {isFetching, dispatch} = React.useContext(AuthContext);

    const handleClick = (e) => {
        e.preventDefault(); //stops the page from refreshing
        loginCall({email: email.current.value, password: password.current.value}, dispatch);
    }

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">JarrodSocial</h3>
                    <span className="loginDescription">Connect with friends and the world on JarrodSocial!!!</span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Email" type="email" required className="loginInput" ref={email}/>
                        <input placeholder="Password" type="password" required className="loginInput" ref={password}/>
                        <button className="logButton" type="submit" disabled={isFetching}>{isFetching ? <CircularProgress size="20px" /> : "Log in"}</button>
                        <span className="loginForgot">Forgot Password</span>
                        <button className="loginRegisterButton" onClick={() => {navigate("/")}}>{isFetching ? <CircularProgress size="20px" /> : "Create a new Account"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
