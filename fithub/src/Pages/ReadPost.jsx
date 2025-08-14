import { db, auth } from "../client.js";
import { useState, useEffect } from 'react'
import Post from '../Components/Post'
import ShowFollow from '../Components/ShowFollow'
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
    const [user, setUser] = useState("");
    const [showSaved, setShowSaved] = useState(false);
    const [modalList, setModalList] = useState(null);

    useEffect(() => {
      if (!auth.currentUser) return;
      const userRef = doc(db, "Users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
              setUser(snapshot.data());
          }
      });
      return () => unsubscribe();
    }, [])

    useEffect(() => {
      if (!auth.currentUser || showSaved) return;
      const q = query(collection(db, "Posts"), where("userId", "==", auth.currentUser.uid), orderBy("created_at", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
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
    }, [showSaved])

    useEffect(() => {
      if (!auth.currentUser || !showSaved || !user.saved?.length) return;
      const q = query(
        collection(db, "Posts"),
        where("__name__", "in", user.saved.slice(0,10))
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          likes: Array.isArray(doc.data().likes) ? doc.data().likes : [],
          tags: Array.isArray(doc.data().tags) ? doc.data().tags : [],
          created_at: doc.data().created_at?.toDate?.() ?? null
        }));
        setPosts(docs);
      });
      return () => unsubscribe();
    }, [showSaved, user.saved]);

    return (
      <div>
        <h2>@{user?.name}</h2>
        <button onClick={() => setModalList("following")}>Following: {user.following?.length}</button>
        <button onClick={() => setModalList("followers")}>Followers: {user.followers?.length}</button>
        <ShowFollow isOpen={!!modalList} onClose={() => setModalList(null)} list={modalList} currUser={user.name}/>
        <button onClick={() => setShowSaved(false)}>My posts</button>
        <button onClick={() => setShowSaved(true)}>Saved</button>
        <div className="posts-container">
            {posts?.length > 0 ? 
                [...posts]
                .map((data) => 
                    <Post key={data.id} id={data.id} userId={data.userId} created_at={data.created_at} description={data.description} likes={data.likes} img={data.img} tags={data.tags} comments={data.comments}/>
                )
                : 
                (
                <div>No posts found.</div>
                )
            }
        </div>
      </div>
    )
}

export default ReadPost