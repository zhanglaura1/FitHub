import { Outlet, Link } from "react-router-dom"

function Layout() {
    return (
        <div>
            <nav>
                <Link to="/">Feed</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/new">New Post</Link>
            </nav>
            <Outlet/>
        </div>
    )
}

export default Layout