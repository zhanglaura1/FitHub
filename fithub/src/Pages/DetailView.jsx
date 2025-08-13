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
    const [curr_user, setCurrUser] = useState(null);

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
        if (!post) return;
        const userRef = doc(db, "Users", post.userId);
        const unsubscribe = onSnapshot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserName(snapshot.data().name);
            }
        });
        return () => unsubscribe();
    }, [id, post])

    useEffect(() => {
        const currUserRef = doc(db, "Users", auth.currentUser.uid);
        const currUnsubscribe = onSnapshot(currUserRef, (snapshot) => {
            if (snapshot.exists()) {
                setCurrUser(snapshot.data());
            }
        });
        return () => currUnsubscribe();
    }, []);

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

    const handleSave = async () => {
        const userRef = doc(db, "Users", auth.currentUser.uid);
        if (curr_user.saved?.includes(id)) {
            await updateDoc(userRef, {
                saved: arrayRemove(id)
            });
        } else {
            await updateDoc(userRef, {
                saved: arrayUnion(id)
            });
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        const postRef = doc(db, "Posts", id);
        await addDoc(collection(db, "Comments"), {
            postId: id,
            userId: auth.currentUser.uid,
            userName: curr_user.name,
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
                    <Link to={"/visit-prof/" + post.userId}>@{user_name}</Link>
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
                    <div className="save">
                        {curr_user.saved?.includes(id) ? 
                            <button className="saved-btn" onClick={handleSave}><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                </svg>
                            </button> : 
                            <button className="unsaved-btn" onClick={handleSave}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                </svg>
                            </button> }
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