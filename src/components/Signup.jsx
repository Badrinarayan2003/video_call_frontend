import { useState } from "react";
import { Link } from "react-router-dom";

import LoginWithGoogle from "./LoginWithGoogle"

import { FaEye,FaEyeSlash } from "react-icons/fa";


const Signup = () => {
    const [isVisible, setIsVisible] = useState(false);



    return (
        <div className="Login-signup-section d-flex justify-content-center align-items-center">
            {/* {errorMsg ? (<p className="signup-error-msg mb-2 fw-bold">Email Already Registered!</p>) : ""} */}
            <form className="login-signup-form">
                <div className="form-logo mb-3">
                    <img src="./images/logo_1.png"/>
                </div>
                <div className="form-heading">
                    <h5 className="fw-bold mb-3">Create your new account</h5>
                </div>
                <div className="login-signup-input-box">
                    <div className="mb-2">
                        <label htmlFor="userName" className="form-label fw-bold mb-1">Your Name</label>
                        <input type="text" className="form-control" id="userName" placeholder="User Name" name="username" required />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="email" className="form-label fw-bold mb-1">Your Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter Email" name="email" required />
                    </div>
                    <div className="mb-2" style={{position:"relative"}}>
                        <label htmlFor="password" className="form-label fw-bold mb-1">New Password</label>
                        <input type={isVisible ? "text" : "password"} className="form-control" id="password" placeholder="Password" name="password" required />
                        <span className="eye-btn"> {isVisible ? <FaEye />  : <FaEyeSlash />}</span>
                    </div>
                    <div className="mb-4" style={{position:"relative"}}>
                        <label htmlFor="password" className="form-label fw-bold mb-1">Confirm Password</label>
                        <input type={isVisible ? "text" : "password"} className="form-control" id="password" placeholder="Password" name="password" required />
                        <span className="eye-btn"> {isVisible ?  <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                </div>

                <div className="login-signup-btn mb-3">
                    <button>Register</button>
                </div>

                <p className="or-sign-in-with text-center mb-2">----------Or sign in with----------</p>

                <div className="d-flex justify-content-center align-items-center mb-2">
                    <LoginWithGoogle />
                </div>
                <p className="register-link text-center mb-2">Have an account? <Link to="/login">Sign in</Link></p>
                <div className="terms-policy mb-2">
                    <span>By using this app, you agree to <a href="#">Terms of Use</a> and <a href="#">Privacy Policy </a>Powerded by B-Shorts</span>
                </div>
            </form>
        </div>
    )
}
export default Signup;

/* :  */ 