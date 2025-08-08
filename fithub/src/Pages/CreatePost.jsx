import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../client.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useState } from 'react';

const CreatePost = () => {
    const user = auth.currentUser;
    const [post, setPost] = useState({likes: [], description: "", tags: [], img: null});

    const handleChange = (event) => {
        const { name, value, type, multiple, options, files } = event.target;        
        setPost((prev) => {
            if (type === "file") {
                return {...prev, [name]: files[0]};   
            }
            if (multiple) {
                const values = Array.from(options).filter(option => option.selected).map(option => option.value);
                return {...prev, [name]: values };
            }
            return  {...prev, [name]: value};
        });
    };

    const createPost = async (event) => {
        event.preventDefault();
        let imageUrl = "";
        
        // Upload image if file exists
        if (post.img instanceof File) {
            const fileRef = ref(storage, `images/${Date.now()}-${post.img.name}`);
            await uploadBytes(fileRef, post.img);
            imageUrl = await getDownloadURL(fileRef);
        }

        // Save post with image URL
        await addDoc(collection(db, "Posts"), {
            ...post,
            userId: user.uid,
            img: imageUrl,
            created_at: serverTimestamp()
        });

        window.location = "/profile";
    }

    return (
        <div>
            <h1>Create a new post</h1>
            <form onSubmit={createPost}>
                <label htmlFor="img">Upload photo (png, jpg, or jpeg): </label>
                <input type="file" id="img" name="img" accept=".png, .jpg, .jpeg" onChange={handleChange} required/>
                <br />
                <label htmlFor="description">Description: </label>
                <textarea id="description" name="description" rows="5" cols="50" value={post.description} onChange={handleChange} required>
                Enter fit discription
                </textarea >
                <br />
                <label htmlFor="tags">Tags: </label>
                <select id="tags" name="tags" multiple value={post.tags} onChange={handleChange}>
                    <option value="" default></option>
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
                <button type="submit">Create Post</button>
            </form>
        </div>
    )
}

export default CreatePost