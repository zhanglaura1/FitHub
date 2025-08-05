import { Link } from 'react-router-dom'

const Post = (props) => {
    const imgUrl = props.img;
    const [count, setCount] = useState(props.likes);
    const updateCount = async (event) => {
        event.preventDefault();
        await supabase.from("Posts").update({likes: count + 1}).eq('id', props.id);
        setCount((count) => count + 1);
        window.location = "/";
    }

    return (
        <div className='post'>
            <h4>@{props.user_name}(usernames not implemented yet)</h4>
            <Link to={"../detail/" + props.id}>{imgUrl ? <img src={imgUrl} art="fit photo"/> : null}</Link>
            <div className="footer">
                <h4>{props.creation_time}</h4>
                <div className="likes">
                    <button className="like-btn" onClick={updateCount}>♡</button>
                    <h4>{props.likes}</h4>
                </div>
            </div>
        </div>
    )
}

export default Post