
import { useState } from "react";
import { Link } from "react-router-dom";

import LoginWithGoogle from "./LoginWithGoogle"
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {


    const [isVisible, setIsVisible] = useState(false);
    return (
        <div className="Login-signup-section d-flex justify-content-center align-items-center">
            {/* {errorMsg ? (<p className="signup-error-msg mb-2 fw-bold">Email Already Registered!</p>) : ""} */}
            <form className="login-signup-form">
                <div className="form-logo mb-3">
                    <img src="./images/logo_1.png" />
                </div>
                <div className="form-heading">
                    <h5 className="fw-bold mb-3">Login to your account</h5>
                </div>
                <div className="login-signup-input-box">
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label fw-bold mb-1">Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter Email" name="email" required />
                    </div>
                    <div className="mb-4" style={{ position: "relative" }}>
                        <label htmlFor="password" className="form-label fw-bold mb-1">Password</label>
                        <input type={isVisible ? "text" : "password"} className="form-control" id="password" placeholder="Password" name="password" required />
                        <span className="eye-btn"> {isVisible ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                </div>

                <div className="forget-pass-box d-flex justify-content-end mb-3">
                    <a href="/">Forgot password?</a>
                </div>

                <div className="login-signup-btn mb-3">
                    <button>Login</button>
                </div>

                <p className="or-sign-in-with text-center mb-3">----------Or sign in with----------</p>

                <div className="d-flex justify-content-center align-items-center mb-3">
                    <LoginWithGoogle />
                </div>
                <p className="register-link text-center mb-3">Don't have an account? <Link to="/signup">Sign Up</Link></p>
                <div className="terms-policy mb-2">
                    <span>By using this app, you agree to <a href="#">Terms of Use</a> and <a href="#">Privacy Policy </a>Powerded by B-Shorts</span>
                </div>
            </form>
        </div>
    )
}
export default Login;