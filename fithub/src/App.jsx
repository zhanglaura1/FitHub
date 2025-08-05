import { useState, useEffect } from 'react'
import { supabase } from '../client'
import Post from '../Components/Post'
import './App.css'

function App() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
          const fetchPosts = async () => {
              const {data} = await supabase.from("Posts").select().order('created_at', {ascending: true})
              setPosts(data);
          }
          fetchPosts();
      }, [])

  return (
    <div>
      <h1>Welcome to Fithub</h1>
      {posts && posts.length > 0 ? 
          [...posts].sort((a,b) => b.id - a.id)
          .map((data) => 
              <Post key={data.id} id={data.id} user_name={data.user_name} creation_time={data.creation_time} description={data.descriptio} likes={data.likes} img={data.img} tags={data.tags} comments={data.comments}/>
          )
          : 
          (
          <div></div>
          )
      }
    </div>
  )
}

export default App
