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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl text-center text-gray-800 mb-6">Sign In</h2>
                {message && <p className="mb-4 text-sm text-center text-red-600">{message}</p>}
                {!showReset ? 
                (<><form onSubmit={handleSubmit} className="space-y-4">
                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="email" placeholder="Email" value={email} onChange={((e) => setEmail(e.target.value))} required/>
                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="password" placeholder="Password" value={password} onChange={((e) => setPassword(e.target.value))} required/>
                    <button className="cursor-pointer w-full py-2 bg-text text-white font-semibold rounded-lg hover:bg-zinc-600 transition" type="submit">Sign In</button>
                </form>
                <div className="mt-4 flex justify-between text-sm text-zinc-600">
                    <Link className="hover:underline" to="../signup">Create an account</Link>
                    <button className="hover:underline" type="button" onClick={() => setShowReset(true)}>Forgot password?</button></div></>) 
                : (<><form onSubmit={handlePasswordReset} className="space-y-4">
                        <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="email" placeholder="Enter your email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required/>
                        <button className="w-full py-2 bg-text text-white font-semibold rounded-lg hover:bg-zinc-600 transition" type="submit">Send Reset Email</button>
                    </form>
                    <button className="mt-4 w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" type="button" onClick={() => setShowReset(false)}>Back to Sign In</button></>)}
                
            </div>
        </div>
    )
}

export default SignIn