import React from 'react'
import "./rightbar.css"
import { Users } from "../../dummyData"
import Online from "../online/Online"
import axios from "axios"
import { AuthContext } from '../../context/AuthContext'
import { Link } from "react-router-dom"
import { Add, Remove } from "@material-ui/icons"

export default function Rightbar({user}) {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [friends, setFriends] = React.useState([]);
    const {user:currentUser, dispatch } = React.useContext(AuthContext);
    const [followed, setFollowed] = React.useState(currentUser.followings.includes(user?.id));

    React.useEffect(() => {
        const getFriends = async () => {
            try {
                if(user._id !== undefined) {
                    const friendList = await axios.get("/users/friends/" + user._id);
                    setFriends(friendList.data);
                }
            } catch (error) {
                console.log(error);                
            }
        };
        getFriends();
    }, [user]);

    const handleClick = async () => {
        try {
            if(!followed) {
                await axios.put(`/users/${user._id}/follow`, {userId: currentUser._id});
                dispatch({type: "FOLLOW", payload: user._id});
            } 
            else {
                await axios.put(`/users/${user._id}/unfollow`, {userId: currentUser._id});
                dispatch({type: "UNFOLLOW", payload: user._id});
            }
            setFollowed(!followed);
        } catch (error) {
            console.log(error);
        }
    }

    const HomeRightbar = () => {
        return (
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImg" src="/assets/gift_icon.png" alt=""/>
                    <span className="birthdayText">
                        <b>Jarrod Harris</b> and <b>3 other friends</b> have a birthday today
                    </span>
                </div>
                <img className="rightbarAd" src="/assets/macdonalds_advertisement.png" alt=""/>
                <h4 className="rightbarTitle">Online Friends</h4>
                <ul className="rightbarFriendList">
                    {Users.map((u) => (<Online key={u.id} user={u}/>))}
                </ul>
            </>
        )
    }

    const ProfileRightbar = () => {
        return (
            <>
                {user.username !== currentUser.username && (
                    <button className="rightbarFollowButton" onClick={handleClick}>
                        {followed ? "Unfollow" : "Follow"}
                        {followed ? <Remove /> : <Add />}
                    </button>
                )}
                <h4 className="rightbarTitle" >User Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship === 1 ? "Single" : user.relationship === 2 ? "Married" : "-"}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle" >User Friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend) => (
                        <Link style={{textDecoration:"none"}} key={friend._id} to={"/profile/" + friend.username}>
                            <div className="rightbarFollowing">
                                <img className="rightbarFollowingImg" src={friend.profilePicture ? PF + friend.profilePicture : PF + "soldier_icon.png"} alt="" />
                                <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        )
    }
    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {user ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    )
}