import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../client";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div>
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={((e) => setEmail(e.target.value))} required/>
                <input type="password" placeholder="Password" value={password} onChange={((e) => setPassword(e.target.value))} required/>
                <button type="submit">Sign In</button>
            </form>
            <Link to="../signup">Create an account</Link>
        </div>
    )
}

export default SignIn