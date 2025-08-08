import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db, storage } from "../client.js";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

const EditPost = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState({user_name: "", likes: 0, description: "", tags: [], img: "", comments: []});

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const postRef = doc(db, "Posts", id);
                const snapshot = await getDoc(postRef);
                if (snapshot.exists()) {
                    setPost(snapshot.data());
                } else {
                    console.warn("Post not found");
                    navigate("/profile");
                }
            } catch (err) {
                console.error("Error fetching post:", err);
            }
        };
        fetchPost();
    }, [id, navigate]);

    const handleChange = (event) => {
        const { name, value, type, multiple, options, files } = event.target;        
        setPost((prev) => {
            if (type === "file") {
                setNewImageFile(files[0]);   
            }
            if (multiple) {
                const values = Array.from(options).filter(option => option.selected).map(option => option.value);
                setPost((prev) => ({ ...prev, [name]: values }));
                return;
            }
            setPost((prev) => ({ ...prev, [name]: value }));
        });
    };

    const updatePost = async (event) => {
        const postRef = doc(db, "Posts", id);
        await updateDoc(postRef, { ...post });
        navigate("/profile");
    }

    const deletePost = async (event) => {
        event.preventDefault();
        try {
            if (post.img) {
                try {
                const imageRef = ref(storage, decodeURIComponent(new URL(post.img).pathname.slice(1)));
                await deleteObject(imageRef);
                } catch (err) {
                console.warn("Image already deleted or not found:", err);
                }
            }
            const postRef = doc(db, "Posts", id);
            await deleteDoc(postRef);
            navigate("/profile");
        } catch (err) {
            console.error("Unexpected error:", err);
        }
        window.location = "/profile";
    }

    return (
        <div>
            <h1>Edit post</h1>
            <form onSubmit={updatePost}>
                <img src={post.img} alt="fit photo" />
                <br />
                <label htmlFor="description">Description: </label>
                <textarea id="description" name="description" rows="5" cols="50" value={post.description} onChange={handleChange} required>
                {post.description}
                </textarea >
                <br />
                <label htmlFor="tags">Tags: </label>
                <select id="tags" name="tags" multiple value={post.tags} onChange={handleChange}>
                    <option value=""></option>
                    <option value="streetwear">Streetwear</option>
                    <option value="y2k">Y2K</option>
                    <option value="vintage">Vintage</option>
                    <option value="cottagecore">Cottagecore</option>
                    <option value="emo">Emo</option>
                    <option value="coquette">Coquette</option>
                    <option value="indie">Indie</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="granola">Granola</option>
                    <option value="monochrome">Monochrome</option>
                    <option value="chic">Chic</option>
                    <option value="basic">Basic</option>
                    <option value="academia">Academia</option>
                    <option value="formal">Formal</option>
                    <option value="business-cas">Business Casual</option>
                    <option value="western">Western</option>
                    <option value="coastal">Coastal</option>
                </select>
                <br />
                <button type="submit" className="update">Update</button>
                <button className="delete" onClick={dialog.showModal()}>Delete</button>
                <dialog>
                    <p>Are you sure you want to delete this post?</p>
                    <button className="delete" onClick={deletePost}>Delete</button>
                    <button className="cancel" onClick={dialog.close()}>Cancel</button>
                </dialog>
            </form>
        </div>
    )
}

export default EditPost