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
    const [currUser, setCurrUser] = useState(null);

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
      const userRef = doc(db, "Users", auth.currentUser.uid);
      const unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
              setCurrUser({ uid: snapshot.id, ...snapshot.data() });
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
        const currUserRef = doc(db, "Users", auth.currentUser.uid);
        if (user.followers?.includes(currUser?.uid)) {
            await updateDoc(userRef, {
                followers: arrayRemove(currUser?.uid)
            });
            await updateDoc(currUserRef, {following: arrayRemove(userId)});
        } else {
            await updateDoc(userRef, {
                followers: arrayUnion(currUser?.uid)
            });
            await updateDoc(currUserRef, {following: arrayUnion(userId)});
        }
    };

    return (
        <div className="p-24">
            <div className="justify-self-center mb-6">
                <h2 className="mt-10 mb-5 text-xl">@{user?.name}</h2>
                <div className="flex gap-10 mb-3 justify-center">
                  <h3>Following: {user?.following?.length}</h3>
                  <h3>Followers: {user?.followers?.length}</h3>
                </div>
            </div>
            {userId === auth.currentUser.uid ? null : <button className="bg-text text-white px-5 py-2 mb-8 rounded-lg cursor-pointer transition duration-200 ease-in-out hover:bg-zinc-600" onClick={handleFollow}>Follow</button>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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