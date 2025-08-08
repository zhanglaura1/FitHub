import { db } from "../client.js";
import { useState, useEffect } from 'react'
import Post from '../Components/Post'
import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

//import { useParams } from 'react-router-dom'

const ReadPost = () => {
    const [posts, setPosts] = useState([]);
    //const {user_name} = useParams();

    useEffect(() => {
        const q = query(collection(db, "Posts"), orderBy("created_at", "desc"));
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            const docs = snapshot.docs.map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                // normalize fields so code below doesn't blow up if something is missing
                name: data.name || "",
                description: data.description || "",
                likes: typeof data.likes === "number" ? data.likes : 0,
                tags: Array.isArray(data.tags) ? data.tags : [],
                img: data.img || "",
                comments: Array.isArray(data.comments) ? data.comments : [],
                created_at: data.created_at ? data.created_at.toDate?.() ?? data.created_at : null
              };
            });
            setPosts(docs);
          },
          (error) => {
            console.error("Error listening to posts:", error);
          }
        );
    
        return () => unsubscribe();
      }, [])

    return (
        <div className="posts-container">
            <h2>@{posts.user_name}(user names not implemented yet)</h2>
            <h3>My posts</h3>
            {posts && posts.length > 0 ? 
                [...posts].sort((a,b) => b.id - a.id)
                .map((data) => 
                    <Post key={data.id} id={data.id} user_name={data.user_name} creation_time={data.creation_time} description={data.description} likes={data.likes} img={data.img} tags={data.tags} comments={data.comments}/>
                )
                : 
                (
                <div>No posts found.</div>
                )
            }
        </div>
    )
}

export default ReadPost