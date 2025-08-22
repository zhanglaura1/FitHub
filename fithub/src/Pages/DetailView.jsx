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
        <div className="justify-self-center p-24">
            <div className="flex flex-col justify-center min-w-lg max-w-2xl mt-10 bg-white py-5 px-10 gap-y-5 rounded-3xl shadow-sm">
                <div className="flex justify-between">
                    <Link to={"/visit-prof/" + post.userId}>@{user_name}</Link>
                    {auth.currentUser?.uid === post.userId ? 
                        <Link className="font-bold" to={"/edit/" + id}>...</Link> : null}
                </div>
                {post.img && <img className="mx-auto rounded-xl" src={post.img} alt="Post" style={{ width: "300px" }} />}
                <p className="text-left">{post.description}</p>
                <div className="flex justify-between">
                    <h4 className="text-sm">{post.created_at?.toDate().toLocaleString()}</h4>
                    <div className="flex gap-x-3">
                        <div className="flex gap-x-1">
                            {post.likes?.includes(auth.currentUser.uid) ? 
                                <button className="bg-none border-none cursor-pointer text-2xl h-0 text-red-600 transition duration-200 ease-in-out hover:scale-120" onClick={handleLike}>♥</button> : 
                                <button className="bg-none border-none font-light cursor-pointer h-0 text-2xl h-0 transition duration-200 ease-in-out hover:scale-120" onClick={handleLike}>♡</button> }
                            <h4>{post.likes?.length}</h4>
                        </div>
                        <div>
                            {curr_user?.saved?.includes(id) ? 
                                <button className="h-4 cursor-pointer transition duration-200 ease-in-out hover:scale-120" onClick={handleSave}><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </button> : 
                                <button className="h-4 cursor-pointer transition duration-200 ease-in-out hover:scale-120" onClick={handleSave}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                                    </svg>
                                </button> }
                        </div>
                    </div>
                </div>
                <div className="flex gap-x-2 flex-wrap">
                    {post.tags.map((tag) => (
                        <h6 key={tag} id={tag} className="bg-gray-200 px-4 py-1 rounded-2xl ">{tag}</h6>
                    ))}
                </div>
            </div>
            <div className="bg-white mt-5 rounded-2xl py-5 px-8 shadow-sm">
                {comments ? comments
                    .map((comment) => (
                    <div className="mb-4 text-left">
                        <div className="flex justify-between ">
                            <h4 className="text-sm">@{comment.userName}</h4>
                            <h4 className="text-xs">{comment.created_at?.toDate().toLocaleString()}</h4>
                        </div>
                        <h4>{comment.text}</h4>
                    </div>
                )) : null}
                <div className="flex justify-between gap-x-4 mt-5">
                    <input className="h-10 w-[calc(80%)] border-1 border-gray-500 bg-white rounded-xl pl-3" type="text" name="comment" placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                    <button className="bg-text text-white px-5 py-2 rounded-lg cursor-pointer transition duration-200 ease-in-out hover:bg-zinc-600" onClick={handleAddComment}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default DetailView