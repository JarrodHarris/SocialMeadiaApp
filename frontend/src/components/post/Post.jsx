import React from 'react'
import './post.css'
import { MoreVert } from '@material-ui/icons'
import axios from "axios"

//HAVING ISSUES, NEED TO RESOLVE
//technically working, but throwing warnings/error
import { format } from "timeago.js"
import { Link } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'

export default function Post({post}) {

    const [like, setLike] = React.useState(post.likes.length);
    const [isLiked, setIsLiked] = React.useState(false);
    const [user, setUser] = React.useState({});
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user:currentUser} = React.useContext(AuthContext);

    React.useEffect(()=>{
        //checks to see if the current user has liked a particular post, so the user can't keep liking it
        setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes])

    React.useEffect(()=>{
        // fetching user from post
        const fetchUser = async () => {
            const response = await axios.get(`/users?userId=${post.userId}`);
            setUser(response.data);
        };
        fetchUser();
    }, [post.userId])

    const likeHandler = () => {
        try {
            axios.put("posts/" + post._id + "/like", {userId: currentUser._id});
        } catch (error) {
            
        }
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
    }

    return(
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`profile/${user.username}`}>
                            <img className="postProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF + "soldier_icon.png"} alt=""/>
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                        {/* <span className="postDate">test</span> */}
                    </div>
                    <div className="postTopRight">
                        <MoreVert />
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post.description}</span>
                    <img className="postImg" src={PF + post.img} alt=""/>
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img className="likeIcon" src={`${PF}like_icon.png`} onClick={likeHandler} alt=""/>
                        <img className="likeIcon" src={`${PF}heart_icon.png`} onClick={likeHandler} alt="" />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">{post.comment} comments</span>
                    </div>
                </div>
            </div>
        </div>
    )
}