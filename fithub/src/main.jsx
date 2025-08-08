import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Layout from './Pages/Layout.jsx'
import CreatePost from './Pages/CreatePost.jsx'
import EditPost from './Pages/EditPost.jsx'
import ReadPost from './Pages/ReadPost.jsx'
import DetailView from './Pages/DetailView.jsx'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import ProtectedRoute from './Components/ProtectedRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/signin" element={<SignIn/>}/>
        <Route path="/" element={<Layout/>}>
          <Route index element={<ProtectedRoute><App /></ProtectedRoute>}/>
          <Route path="/new" element={<ProtectedRoute><CreatePost/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><ReadPost/></ProtectedRoute>}/>
          <Route path="/edit/:id" element={<ProtectedRoute><EditPost/></ProtectedRoute>}/>
          <Route path="/detail/:id" element={<ProtectedRoute><DetailView/></ProtectedRoute>}/>
          <Route path="*"
                element={
                  <main>
                    <p>There's nothing here!</p>
                    <Link to="/">Back to Home</Link>
                  </main>
                }
              />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
