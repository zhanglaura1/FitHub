import { db, auth } from "../client.js";
import { useState, useEffect } from 'react'
import Post from '../Components/Post'
import {
  collection,
  doc,
  where,
  query,
  orderBy,
  onSnapshot
} from "firebase/firestore";

const ReadPost = () => {
    const [posts, setPosts] = useState([]);
    const [user_name, setUserName] = useState("");

    useEffect(() => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "Users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
              setUserName(snapshot.data().name);
          }
      });
      return () => unsubscribe();
    }, [])

    useEffect(() => {
      if (!auth.currentUser) return;
      const q = query(collection(db, "Posts"), where("userId", "==", auth.currentUser.uid), orderBy("created_at", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              // normalize fields so code below doesn't blow up if something is missing
              userId: data.userId || "",
              description: data.description || "",
              likes: Array.isArray(data.likes) ? data.likes : [],
              tags: Array.isArray(data.tags) ? data.tags : [],
              img: data.img || "",
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
            <h2>@{user_name}</h2>
            <h3>My posts</h3>
            {posts && posts.length > 0 ? 
                [...posts]
                .map((data) => 
                    <Post key={data.id} id={data.id} userId={data.userId} creation_time={data.created_at} description={data.description} likes={data.likes} img={data.img} tags={data.tags} comments={data.comments}/>
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