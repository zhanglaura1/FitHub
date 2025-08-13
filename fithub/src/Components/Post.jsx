import { Link } from 'react-router-dom'
import { db, auth } from "../client.js";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from 'react'

const Post = (props) => {
    const imgUrl = props.img;
    const [user_name, setUserName] = useState("");

    useEffect(() => {
        const userRef = doc(db, "Users", props.userId);
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserName(snapshot.data().name);
            }
        });
        return () => unsubscribe();
    }, [])
    
    const handleLike = async () => {
        const postRef = doc(db, "Posts", props.id);
        if (props.likes?.includes(auth.currentUser.uid)) {
            await updateDoc(postRef, {
                likes: arrayRemove(auth.currentUser.uid)
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(auth.currentUser.uid)
            });
        }
    };

    return (
        <div className='post-card'>
            <Link to={"/visit-prof/" + props.userId}>@{user_name}</Link>
            <Link to={"../detail/" + props.id}>{imgUrl ? <img src={imgUrl} alt="fit photo"/> : null}</Link>
            <div className="footer">
                <h4>{props.created_at?.toLocaleString()}</h4>
                <div className="likes">
                    {props.likes?.includes(auth.currentUser.uid) ? 
                        <button className="liked-btn" onClick={handleLike}>♥</button> : 
                        <button className="unliked-btn" onClick={handleLike}>♡</button> }
                    <h4>{props.likes?.length || 0}</h4>
                </div>
            </div>
        </div>
    )
}

export default Post