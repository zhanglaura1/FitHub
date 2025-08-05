import { useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { supabase } from '../client'
import { Link } from 'react-router-dom'

const DetailView = () => {
    const { id } = useParams();

    const [post, setPost] = useState(null);
    useEffect(() => {
        const fetchPosts = async () => {
            const {data} = await supabase.from("Posts").select().eq('id', id);
            SetPost(data[0]);
        }
        fetchPosts();
    }, [id])

    const [count, setCount] = useState(post.likes);
    const updateCount = async (event) => {
        event.preventDefault();
        await supabase.from("Posts").update({likes: count + 1}).eq('id', post.id);
        setCount((count) => count + 1);
        window.location = "/";
    }

    const [newComment, setNewComment] = useState("");
    const addComment = async (event) => {
        if (!newComment.trim()) return; // Prevent empty comments

        const updatedComments = [...(post.comments || []), newComment];
        await supabase.from("Posts").update({ comments: updatedComments }).eq('id', post.id);

        setPost((prev) => ({
            ...prev,
            comments: updatedComments
        }));
        setNewComment("");
    }

    const imgUrl = post ? post.img : null;

    return (
        <div>
            <div className="main">
                <div className="header">
                    <h4>@{post.user_name}(usernames not implemented yet)</h4>
                    <Link to={"/edit" + post.id}><button>...</button></Link>
                </div>
                {imgUrl ? <img src={imgUrl} art="fit photo"/> : null}
                <p>{post.description}</p>
                <div className="footer">
                    <h4>{post.creation_time}</h4>
                    <div className="likes">
                        <button className="like-btn" onClick={updateCount}>♡</button>
                        <h4>{post.likes}</h4>
                    </div>
                </div>
                <span>
                    {post.tags.map((tag) => (
                        <h6 key={tag} id={tag}>{tag}</h6>
                    ))}
                </span>
            </div>
            <div className="comments">
                {post.comments.map((comment) => (
                    <h4>{comment}</h4>
                ))}
                <div className="makeComment">
                    <input type="text" name="comment" placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                    <button onClick={addComment}>Send</button>
                </div>
            </div>
        </div>
    )
}