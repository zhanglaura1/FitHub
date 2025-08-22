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
        <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-50 p-0 m-0 overflow-x-hidden">
            <div className="h-[75vh] flex lg:flex-row gap-x-[calc(20%)] items-center w-full px-[calc(15%)]">
                <div className="text-center lg:text-left space-y-6">
                    <h2 className="text-6xl font-bold text-text tracking-tight">Fithub</h2>
                    <h1 className="text-3xl font-semibold text-slate-600">Show us your OOTDs</h1>
                </div>
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
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
            <section className="w-screen">
                <div className="h-[75vh] flex items-center justify-center bg-gradient-to-r from-slate-50 to-slate-200 text-text">
                    <h1 className="text-center text-6xl font-extrabold leading-tight">
                        <span className="text-text">Search </span>
                        <span className="text-slate-600">Different </span>
                        <span className="block text-text">Style Types</span>
                    </h1>
                </div>
                <div className="h-[75vh] flex items-center justify-center text-white relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-300/70 to-transparent"></div>
                    <h1 className="relative text-center text-6xl font-extrabold leading-snug">
                        <span className="text-text">Discover</span>{" "}
                        <span className="text-slate-600">New</span>{" "}
                        <span className="text-text block">Styles</span>
                    </h1>
                </div>
                <div className="h-[75vh] flex items-center justify-center text-test relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-white mix-blend-multiply opacity-60"></div>
                    <h1 className="relative text-center text-6xl font-extrabold leading-tight">
                        <span className="block text-text">Save Them For Later</span>
                        <span className="block text-slate-600">Inspo</span>
                    </h1>
                </div>
            </section>
        </div>
    )
}

export default SignIn