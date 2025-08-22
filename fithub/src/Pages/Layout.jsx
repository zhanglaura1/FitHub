import { Outlet, Link, useNavigate } from "react-router-dom"
import { signOut } from "firebase/auth";
import { auth } from "../client.js";

function Layout() {
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await signOut(auth);
            console.log("User signed out");
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    }

    return (
        <div className="max-width-1280px">
            <nav className="fixed top-0 left-0 right-0 flex gap-x-10 bg-slate-100 pl-[calc(10%)] py-5 shadow">
                <Link to="/">Feed</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/new">New Post</Link>
                <button onClick={handleLogout} className="absolute right-[calc(10%)] cursor-pointer">Log out</button>
            </nav>
            <Outlet/>
        </div>
    )
}

export default Layout