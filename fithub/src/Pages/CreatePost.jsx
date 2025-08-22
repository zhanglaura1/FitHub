import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, storage } from "../client.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

const CreatePost = () => {
    const user = auth.currentUser;
    const navigate = useNavigate();
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
        navigate("/profile");
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 p-24">
            <h1 className="text-black text-center text-4xl m-10">Create a new post</h1>
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
                <form onSubmit={createPost} className="space-y-6">
                    <label htmlFor="img" className="mr-2 text-sm font-medium text-gray-700 mb-2">Upload photo (png, jpg, or jpeg): </label>
                    <input className="pl-3 align-self w-100px text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    type="file" id="img" name="img" accept=".png, .jpg, .jpeg" onChange={handleChange} required/>
                    <br />
                    <label htmlFor="description" className="block text-left text-sm font-medium text-gray-700 mb-2">Description: </label>
                    <textarea className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                    id="description" name="description" rows="5" cols="50" value={post.description} onChange={handleChange} placeholder="Enter fit discription" required></textarea >
                    <br />
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 mr-3" htmlFor="tags">Tags: </label>
                        <select className="w-40 border border-gray-300 text-gray-700 bg-white rounded-lg pl-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                        id="tags" name="tags" multiple value={post.tags} onChange={handleChange}>
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
                        <p className="text-xs text-gray-500 mt-1">Hold CTRL (Windows) or ⌘ (Mac) to select multiple tags.</p>
                    </div>
                    <br />
                    <button className="w-full bg-text text-white py-3 rounded-lg font-semibold hover:bg-zinc-600 transition duration-200" type="submit">Create Post</button>
                </form>
            </div>
        </div>
    )
}

export default CreatePost