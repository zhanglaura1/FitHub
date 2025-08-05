import { supabase } from '../client'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

const EditPost = () => {
    const {id} = useParams();
    const [post, setPost] = useState({name: "", likes: 0, description: "", tags: [], img: ""});

    useEffect(() => {
        const fetchPost = async () => {
            const {data} = await supabase.from("Posts").select().eq("id", id);
            if (data && data.length > 0) {
                setPost(data[0]);
            };
        }
        fetchPost();
    }, [id]);

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

    const updatePost = async (event) => {
        event.preventDefault();
        await supabase.from('Posts').update({ ...post }).eq('id', id);
        window.location = "/profile";
    }

    const deletePost = async (event) => {
        event.preventDefault();
        try {
            // Extract file path from public URL
            const publicUrl = post.img;
            const bucketName = 'images';
            const pathStart = publicUrl.indexOf(`/object/public/${bucketName}/`);
            if (pathStart !== -1) {
                const filePath = publicUrl.slice(pathStart + `/object/public/${bucketName}/`.length);
                // Delete the image from storage
                await supabase.storage.from(bucketName).remove([filePath]);
            }
            // Delete the post from the database
            await supabase.from("Posts").delete().eq("id", id);
            window.location = "/profile";
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
                <button className="delete" onClick={deletePost}>Delete</button>
            </form>
        </div>
    )
}

export default EditPost