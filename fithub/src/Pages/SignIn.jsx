import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithRedirect, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../client.js";
import { useNavigate, Link } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [resetEmail, setResetEmail] = useState("");
    const [showReset, setShowReset] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            setMessage(err.message);
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setMessage("Password reset email sent!");
            setShowReset(false);
        } catch (err) {
            setMessage(err.message);
        }
    }

    return (
        <div>
            <h2>Sign In</h2>
            {message && <p>{message}</p>}
            {!showReset ? 
            (<><form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={((e) => setEmail(e.target.value))} required/>
                <input type="password" placeholder="Password" value={password} onChange={((e) => setPassword(e.target.value))} required/>
                <button type="submit">Sign In</button>
            </form>
            <Link to="../signup">Create an account</Link>
            <button type="button" onClick={() => setShowReset(true)}>Forgot password?</button></>) 
            : (<><form onSubmit={handlePasswordReset}>
                    <input type="email" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required/>
                    <button type="submit">Send Reset Email</button>
                </form>
                <button type="button" onClick={() => setShowReset(false)}>Back to Sign In</button></>)}
        </div>
    )
}

export default SignIn