import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LoginWithGoogle from "./LoginWithGoogle"

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [isVisibleOne, setIsVisibleOne] = useState(false);
    const [isVisibleTwo, setIsVisibleTwo] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [result, setResult] = useState(null);
    const [passwordMatchError, setPasswordMatchError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [isEmailExit, setIsEmailExit] = useState();

    useEffect(() => {
        console.log(result);
    }, [result])

    const navigate = useNavigate();

    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (password !== confirmPassword) {
            console.log("Passwords do not match!");
            setPasswordMatchError("Passwords do not match!");
            return;
        }

        try {
            const response = await fetch("https://miki.a2gakhir.com/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Send data as JSON
                },
                body: JSON.stringify({
                    name: name, // User's name
                    email: email, // User's email
                    password: password, // User's password
                    password_confirmation: confirmPassword, // Password confirmation
                }),
            })

            if (response.ok) {
                const data = await response.json();
                setResult(data); // Handle the response
                console.log("Account created successfully:", data);

                if (data) {
                    navigate("/login")
                }

            } else {
                const errorData = await response.json();
                console.log(errorData, "error data");

                // if (errorData.password) {
                //     console.log(errorData.password[0]);
                //     errorData.Map((pass)=>{
                //         console.log(pass,"my passsssss");
                //         setPasswordError(errorData.password[0]);
                //     })
                // } else if (errorData.email) {
                //     console.log(errorData.email[0]);
                //     // setPasswordError(true);
                // }
                // else {
                //     console.log("Failed to create account:", response.status);
                // }

                if (errorData) {
                    if (errorData.email) {
                        console.log(errorData.email, "email already exit!!!!");
                        setIsEmailExit(errorData.email)
                    } else if (errorData.password) {
                        console.log(errorData.password, "password must be 6 charcter!!!");
                        setPasswordError(errorData.password)
                    } else {
                        console.log("nothing error present!!-----!!");
                    }

                }
            }


        } catch (error) {
            console.log("my signup Error:", error)
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
                    <h5 className="fw-bold mb-3">Create your new account</h5>
                </div>
                <div className="login-signup-input-box">
                    <div className="mb-2">
                        <label htmlFor="userName" className="form-label fw-bold mb-1">Your Name</label>
                        <input type="text" className="form-control" id="userName" placeholder="Enter Your Name" name="name" onChange={(e) => setName(e.target.value)} value={name} required />
                    </div>
                    <div className="mb-2">
                        {isEmailExit ? (<p className="mb-0 password-error-msg">{isEmailExit}</p>) : ""}
                        <label htmlFor="email" className="form-label fw-bold mb-1">Your Email</label>
                        <input type="email" className="form-control" id="email" placeholder="Enter Email" name="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                    </div>
                    <div className="mb-2" style={{ position: "relative" }}>
                        {passwordMatchError ? (<p className="mb-0 password-error-msg">{passwordMatchError}</p>) : ""}
                        {passwordError ? (<p className="mb-0 password-error-msg">{passwordError}</p>) : ""}
                        <label htmlFor="password" className="form-label fw-bold mb-1">New Password</label>
                        <input type={isVisibleOne ? "text" : "password"} className="form-control" id="password" placeholder="Password" name="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <span className="eye-btn" onClick={() => setIsVisibleOne(!isVisibleOne)}> {isVisibleOne ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                    <div className="mb-4" style={{ position: "relative" }}>
                        <label htmlFor="c_password" className="form-label fw-bold mb-1">Confirm Password</label>
                        <input type={isVisibleTwo ? "text" : "password"} className="form-control" id="c_password" placeholder="Confirm Password" name="confirm_password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} required />
                        <span className="eye-btn" onClick={() => setIsVisibleTwo(!isVisibleTwo)}> {isVisibleTwo ? <FaEye /> : <FaEyeSlash />}</span>
                    </div>
                </div>

                <div className="login-signup-btn mb-3">
                    <button onClick={handleSubmit}>Register</button>
                </div>

                <p className="or-sign-in-with text-center mb-2">----------Or sign in with----------</p>

                <div className="d-flex justify-content-center align-items-center mb-2">
                    <LoginWithGoogle />
                </div>
                <p className="register-link text-center mb-3">Have an account? <Link to="/login">Sign in</Link></p>
                <div className="terms-policy mb-2">
                    <span>By using this app, you agree to <a href="/">Terms of Use</a> and <a href="/">Privacy Policy </a>Powerded by B-Shorts</span>
                </div>
            </form>
        </div>
    )
}
export default Signup;