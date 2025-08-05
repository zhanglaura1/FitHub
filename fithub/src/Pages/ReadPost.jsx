import { supabase } from '../client'
import { useState, useEffect } from 'react'
import Post from '../Components/Post'
//import { useParams } from 'react-router-dom'

const ReadPost = () => {
    const [posts, setPosts] = useState([]);
    //const {user_name} = useParams();

    useEffect(() => {
        const fetchPosts = async () => {
            const {data} = await supabase.from("Posts").select().order('created_at', {ascending: true})
            setPosts(data);
        }
        fetchPosts();
    }, [])

    return (
        <div>
            <h3>My posts</h3>
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

export default ReadPost