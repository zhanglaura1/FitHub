import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, BrowserRouter, Link } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<App />}/>
        <Route path="/new" element={<CreatePost/>}/>
        <Route path="/profile" element={<ReadPost/>}/>
        <Route path="/edit/:id" element={<EditPost/>}/>
        <Route path="/detail/:id" element={<DetailView/>}/>
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
  </StrictMode>,
)
