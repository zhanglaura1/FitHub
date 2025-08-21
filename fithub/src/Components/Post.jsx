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
        <div className='flex flex-col gap-y-2 align-center bg-white rounded-md shadow-lg px-6 py-3 transition duration-200 ease-in-out hover:-translate-y-3'>
            <Link to={"/visit-prof/" + props.userId}>@{user_name}</Link>
            <Link to={"../detail/" + props.id}>{imgUrl ? <img src={imgUrl} alt="fit photo" className="w-full max-h-[400px] rounded-md object-cover"/> : null}</Link>
            <div className="flex justify-between">
                <h4 className="text-sm">{props.created_at?.toLocaleString()}</h4>
                <div className="flex gap-x-1">
                    {props.likes?.includes(auth.currentUser.uid) ? 
                        <button className="bg-none border-none cursor-pointer text-xl h-0 text-red-600 transition duration-200 ease-in-out hover:scale-120" onClick={handleLike}>♥</button> : 
                        <button className="bg-none border-none cursor-pointer text-xl h-0 transition duration-200 ease-in-out hover:scale-120" onClick={handleLike}>♡</button> }
                    <h4 className="pt-0.5">{props.likes?.length || 0}</h4>
                </div>
            </div>
        </div>
    )
}

export default Post