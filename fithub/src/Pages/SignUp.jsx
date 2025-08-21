import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (password !== confirmPass) {
            alert("Passwords do not match.");
            return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const saved = [];
        const following = [];
        const followers = [];
        await setDoc(doc(db, "Users", user.uid), {name, email, saved, following, followers, created_at: serverTimestamp()});
        navigate("/");
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl text-center text-gray-800 mb-6">Create an Account</h2>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="text" placeholder="User name" value={name} onChange={((e) => setName(e.target.value))} required/>
                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="email" placeholder="Email" value={email} onChange={((e) => setEmail(e.target.value))} required/>
                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="password" placeholder="Password" value={password} onChange={((e) => setPassword(e.target.value))} required/>
                    <input className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" type="password" placeholder="Confirm Password" value={confirmPass} onChange={((e) => setConfirmPass(e.target.value))} required/>
                    <button className="cursor-pointer w-full py-2 bg-text text-white font-semibold rounded-lg hover:bg-zinc-600 transition" type="submit">Create Account</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp