import React from 'react'
import "./feed.css"
import Share from "../share/Share"
import Post from "../post/Post"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext'

export default function Feed({username}) {

    const [posts, setPosts] = React.useState([]);
    const {user} = React.useContext(AuthContext);

    React.useEffect(()=>{
        const fetchPosts = async () => {
            const response = username
            ? await axios.get("/posts/profile/" + username)
            : await axios.get("/posts/timeline/" + user._id);
            
            //sets the posts on that appear on the feed with the earliest 'createdAt' post showing first and so on
            setPosts(response.data.sort((p1, p2) => {
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }));
        };
        fetchPosts();
    },[username, user._id])   // the empty array means to only trigger/render this once when the function 'Feed' is executed

    return (
        <div className="feed">
            <div className="feedWrapper">
                {(!username || username === user.username) && <Share />}
                {posts.map((p) => (
                    <Post key={p._id} post={p}/>
                ))}
            </div>
        </div>
    )
}