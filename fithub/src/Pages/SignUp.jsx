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
        await setDoc(doc(db, "Users", user.uid), {name, email, created_at: serverTimestamp()});
        navigate("/");
    }

    return (
        <div>
            <h2>Create an Account</h2>
            <form onSubmit={handleSignUp}>
                <input type="text" placeholder="User name" value={name} onChange={((e) => setName(e.target.value))} required/>
                <input type="email" placeholder="Email" value={email} onChange={((e) => setEmail(e.target.value))} required/>
                <input type="password" placeholder="Password" value={password} onChange={((e) => setPassword(e.target.value))} required/>
                <input type="password" placeholder="Confirm Password" value={confirmPass} onChange={((e) => setConfirmPass(e.target.value))} required/>
                <button type="submit">Create Account</button>
            </form>
        </div>
    )
}

export default SignUp