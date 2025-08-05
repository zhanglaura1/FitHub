import { Outlet, Link } from "react-router-dom"

function Layout() {
    return (
        <div>
            <nav>
                <Link to="/"><button className="nav_button">Feed</button></Link>
                <Link to="/profile"><button className="nav_button">Profile</button></Link>
                <Link to="/new"><button className="nav_button">New Post</button></Link>
            </nav>
            <Outlet/>
        </div>
    )
}

export default Layout