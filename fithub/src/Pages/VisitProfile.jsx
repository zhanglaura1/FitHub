import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { db, auth } from "../client.js";
import Post from '../Components/Post'
import {
  collection,
  doc,
  where,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const VisitProfile = () => {
    const { userId } = useParams();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const userRef = doc(db, "Users", userId);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
              setUser(snapshot.data());
          }
      });
      return () => unsubscribe();
    }, [])

    useEffect(() => {
      const q = query(collection(db, "Posts"), where("userId", "==", userId), orderBy("created_at", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const docs = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              userId: data.userId || "",
              name: data.name || "",
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
    }, [user, userId]);

    const handleFollow = async () => {
        const userRef = doc(db, "Users", userId);
        if (user.followers?.includes(auth.currentUser.uid)) {
            await updateDoc(userRef, {
                followers: arrayRemove(auth.currentUser.uid)
            });
        } else {
            await updateDoc(userRef, {
                followers: arrayUnion(auth.currentUser.uid)
            });
        }
    };

    return (
        <div>
            <div className="header">
                <h2>@{user?.name}</h2>
                <h3>Following: {user?.following?.length}</h3>
                <h3>Followers: {user?.followers?.length}</h3>
            </div>
            <button className="follow" onClick={handleFollow}>Follow</button>
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

export default VisitProfile