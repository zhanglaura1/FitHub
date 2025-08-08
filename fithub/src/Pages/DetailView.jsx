import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { db } from "../client.js";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
  onSnapshot
} from "firebase/firestore";
import { Link } from 'react-router-dom'

const DetailView = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const postRef = doc(db, "Posts", id);
        const unsubscribe = onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
            setPost(snapshot.data());
        }
        });
        return () => unsubscribe();
    }, [id])

    const handleLike = async () => {
        const postRef = doc(db, "Posts", id);
        await updateDoc(postRef, {
            likes: increment(1)
        });
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const postRef = doc(db, "Posts", id);
        await updateDoc(postRef, {
            comments: arrayUnion(newComment.trim())
        });

        setNewComment(""); // clear input
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div>
            <div className="post-card">
                <div className="header">
                    <h4>@{post.user_name}(user name not implemented yet)</h4>
                    <Link to={"/edit/" + id}><button>...</button></Link>
                </div>
                {post.img && <img src={post.img} alt="Post" style={{ width: "300px" }} />}
                <p>{post.description}</p>
                <div className="footer">
                    <h4>{post.creation_time}</h4>
                    <div className="likes">
                        <button className="like-btn" onClick={handleLike}>♡</button>
                        <h4>{post.likes || 0}</h4>
                    </div>
                </div>
                <div className="tags">
                    {post.tags.map((tag) => (
                        <h6 key={tag} id={tag} className="tag">{tag}</h6>
                    ))}
                </div>
            </div>
            <div className="comments">
                {post.comments.map((comment) => (
                    <h4>{comment}</h4>
                ))}
                <div className="makeComment">
                    <input type="text" name="comment" placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                    <button onClick={handleAddComment}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default DetailView