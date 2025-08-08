import { Link } from 'react-router-dom'
import { db } from "../client.js";
import {
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

const Post = (props) => {
    const imgUrl = props.img;
    const handleLike = async () => {
        const postRef = doc(db, "Posts", props.id);
        await updateDoc(postRef, {
            likes: increment(1)
        });
    };

    return (
        <div className='post-card'>
            <h4>@{props.user_name}(user name not implemented yet)</h4>
            <Link to={"../detail/" + props.id}>{imgUrl ? <img src={imgUrl} art="fit photo"/> : null}</Link>
            <div className="footer">
                <h4>{props.creation_time}</h4>
                <div className="likes">
                    <button className="like-btn" onClick={handleLike}>♡</button>
                    <h4>{props.likes}</h4>
                </div>
            </div>
        </div>
    )
}

export default Post