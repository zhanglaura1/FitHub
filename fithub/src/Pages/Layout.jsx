import { Outlet, Link } from "react-router-dom"

function Layout() {
    return (
        <div>
            <nav>
                <Link to="/"><button className="nav_button">Feed</button></Link>
                <Link to="/profile"><button className="nav_button">Profile</button></Link>
            </nav>
            <Outlet/>
        </div>
    )
}

export default Layout