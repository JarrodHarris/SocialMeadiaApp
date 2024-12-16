import axios from 'axios';
import React from 'react'
import "./register.css"
import { useNavigate } from "react-router-dom"  //can send user back to previous page or any other pages

export default function Register() {

    const username = React.useRef();
    const email = React.useRef();
    const password = React.useRef();
    const passwordAgain = React.useRef();

    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();

        if(passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords do not match!"); //creates a comment that displays on the UI
        } 
        else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("auth/register", user);
                navigate("/login");
            } catch (error) {
                console.log(error);
            }
        }
    }

    return (
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <h3 className="registerLogo">JarrodSocial</h3>
                    <span className="registerDescription">Connect with friends and the world on JarrodSocial!!!</span>
                </div>
                <div className="registerRight">
                    <form className="registerBox" onSubmit={handleClick}>
                        <input placeholder="Username" className="registerInput" required ref={username} />
                        <input placeholder="Email" className="registerInput" type="email" required ref={email} />
                        <input placeholder="Password" className="registerInput" type="password" required ref={password} />
                        <input placeholder="Password Again" className="registerInput" type="password" required ref={passwordAgain} />
                        <button className="registerButton" type="submit">Sign up</button>
                        <button className="loginButton" onClick={() => {navigate("/login");}}>Log into Account</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
