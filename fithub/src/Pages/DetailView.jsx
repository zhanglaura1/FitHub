import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { db, auth } from "../client.js";
import { doc, updateDoc, addDoc, serverTimestamp, arrayUnion,
  arrayRemove, onSnapshot, query, collection, where, orderBy
} from "firebase/firestore";
import { Link } from 'react-router-dom'

const DetailView = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [user_name, setUserName] = useState("");

    useEffect(() => {
        const postRef = doc(db, "Posts", id);
        const unsubscribe = onSnapshot(postRef, (snapshot) => {
        if (snapshot.exists()) {
            setPost(snapshot.data());
        }
        });
        return () => unsubscribe();
    }, [id])

    useEffect(() => {
        const q = query(collection(db, "Comments"), where("postId", "==", id), orderBy("created_at", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [id])

    useEffect(() => {
        const userRef = doc(db, "Users", auth.currentUser.uid);
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserName(snapshot.data().name);
            }
        });
        return () => unsubscribe();
    }, [id])

    const handleLike = async () => {
        const postRef = doc(db, "Posts", id);
        if (post.likes?.includes(auth.currentUser.uid)) {
            await updateDoc(postRef, {
                likes: arrayRemove(auth.currentUser.uid)
            });
        } else {
            await updateDoc(postRef, {
                likes: arrayUnion(auth.currentUser.uid)
            });
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const postRef = doc(db, "Posts", id);
        await addDoc(collection(db, "Comments"), {
            postId: id,
            userId: auth.currentUser.uid,
            userName: user_name,
            text: newComment.trim(),
            created_at: serverTimestamp(),
        });

        setNewComment(""); // clear input
    };

    if (!post) return <p>Loading...</p>;

    return (
        <div>
            <div className="post-card">
                <div className="header">
                    <h4>@{user_name}</h4>
                    {auth.currentUser?.uid === post.userId ? 
                        <Link to={"/edit/" + id}>...</Link> : null}
                </div>
                {post.img && <img src={post.img} alt="Post" style={{ width: "300px" }} />}
                <p>{post.description}</p>
                <div className="footer">
                    <h4>{post.created_at?.toDate().toLocaleString()}</h4>
                    <div className="likes">
                        {post.likes?.includes(auth.currentUser.uid) ? 
                            <button className="liked-btn" onClick={handleLike}>♥</button> : 
                            <button className="unliked-btn" onClick={handleLike}>♡</button> }
                        <h4>{post.likes?.length}</h4>
                    </div>
                </div>
                <div className="tags">
                    {post.tags.map((tag) => (
                        <h6 key={tag} id={tag} className="tag">{tag}</h6>
                    ))}
                </div>
            </div>
            <div className="comments">
                {comments ? comments
                    .map((comment) => (
                    <div className="comment">
                        <h4 className="comment-user">@{comment.userName}</h4>
                        <h4>{comment.created_at?.toDate().toLocaleString()}</h4>
                        <h4>{comment.text}</h4>
                    </div>
                )) : null}
                <div className="makeComment">
                    <input type="text" name="comment" placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                    <button onClick={handleAddComment}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default DetailView