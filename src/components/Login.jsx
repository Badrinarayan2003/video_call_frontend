
import {useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoginWithGoogle from "./LoginWithGoogle"
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Login = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [result, setResult] = useState({});

    const navigate = useNavigate();


    useEffect(() => {
        console.log(result);
    }, [result])

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        try {
            const response = await fetch("https://miki.a2gakhir.com/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })


            if (response.ok) {
                const data = await response.json();
                console.log(data, "data login")
                setResult(data)
                if (data) {
                    navigate("/profile")
                }

            } else {
                const errorData = await response.json();
                console.log(errorData, "login error data");
                console.log("Failed to sign in:", response.status);
            }
        } catch (error) {
            console.log("Error:", error);
        }

    }


    return (
        <div className="Login-signup-section d-flex justify-content-center align-items-center">
            {/* {errorMsg ? (<p className="signup-error-msg mb-2 fw-bold">Email Already Registered!</p>) : ""} */}
            <form className="login-signup-form">
                <div className="form-logo mb-3">
                    <img src="./images/logo_1.png" alt="logo" />
                </div>
                <div className="form-heading">
                    <h5 className="fw-bold mb-3">Login to your account</h5>
                </div>
                <div className="login-signup-input-box">
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label fw-bold mb-1">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                    </div>
                    <div className="mb-4" style={{ position: "relative" }}>
                        <label htmlFor="password" className="form-label fw-bold mb-1">Password</label>
                        <input type={isVisible ? "text" : "password"} className="form-control" id="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <span className="eye-btn" onClick={() => setIsVisible(!isVisible)}> {isVisible ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                </div>

                <div className="forget-pass-box d-flex justify-content-end mb-3">
                    <a href="/">Forgot password?</a>
                </div>

                <div className="login-signup-btn mb-3">
                    <button onClick={handleSubmit}>Login</button>
                </div>

                <p className="or-sign-in-with text-center mb-3">----------Or sign in with----------</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    <LoginWithGoogle />
                </div>
                <p className="register-link text-center mb-3">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                <div className="terms-policy mb-2">
                    <span>By using this app, you agree to <a href="/">Terms of Use</a> and <a href="/">Privacy Policy </a>Powerded by B-Shorts</span>
                </div>
            </form>
        </div>
    )
}
export default Login;