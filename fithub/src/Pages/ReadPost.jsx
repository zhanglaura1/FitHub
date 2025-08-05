import { supabase } from '../client'
import { useState, useEffect } from 'react'
import Post from '../Components/Post'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

const ReadPost = () => {
    const [posts, setPosts] = useState([]);
    const {user_name} = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            if (user_name === "main") {
                const {data} = await supabase.from("Posts").select().order('created_at', {ascending: true})
            } else {
                const {data} = await supabase.from("Posts").select().eq("name", user_name).order('created_at', {ascending: true})
            }
            setPosts(data);
        }
        fetchPosts();
    }, [])

    return (
        <div>
            {posts && posts.length > 0 ? 
                [...posts].sort((a,b) => b.id - a.id)
                .map((data) => 
                    <Post key={data.id} id={data.id} description={data.descriptio} likes={data.likes} img={data.img} tags={data.tags}/>
                )
                : 
                (
                <div></div>
                )
            }
        </div>
    )
}

export default ReadPost