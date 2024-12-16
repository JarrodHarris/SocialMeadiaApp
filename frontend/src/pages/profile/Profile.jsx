import React from 'react'
import './profile.css'
import axios from "axios"
import { useParams } from "react-router"
import Topbar from "../../components/topbar/Topbar"
import Leftbar from "../../components/leftbar/Leftbar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"
import { AuthContext } from '../../context/AuthContext'

export default function Profile() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const [user, setUser] = React.useState({});
    const username = useParams().username;
    const [file, setFile] = React.useState(null);
    const [saveChangesVisibility, setSaveChangesVisibility] = React.useState(false);
    const [profileManipulation, setProfileManipulation] = React.useState(false);
    const {user:currentUser} = React.useContext(AuthContext);

    const userImgIcon = React.useRef();

    React.useEffect(()=>{
        const fetchUser = async () => {
            const response = await axios.get(`/users?username=${username}`);
            setUser(response.data);
        };
        fetchUser();
    }, [username])

    React.useEffect(() => {
        if(currentUser.username !== username) {
            setProfileManipulation(false);
        }
        else {
            setProfileManipulation(true);
        }
    }, [username])

    const uploadUserImg = async (e) => {
        // e.preventDefault();
        userImgIcon.current.click();
        setSaveChangesVisibility(!saveChangesVisibility);
    }

    const submit = async (e) => {
        const data = new FormData();
        const fileName = file.name;
        data.append("name", fileName);
        data.append("file", file);

        try {
            //upload file to storage area
            await axios.post("/uploadProfilePicture", data);
            console.log("success");
            
        } catch (error) {
            console.log(error);
        }

        try {
            //update user's profilePicture
            await axios.put("/users/updateProfilePicture/" + user._id, {profilePicture: fileName});
            console.log("profile picture updated!");



            //THESE NEED TO BE ADDRESSED
            //NEEDS THE USER IN LOCALSTORAGE TO BE UPDATED WITH PROFILEPICTURE FOR THE REST OF THE
            //COMPONENTS TO BE UPDATED

            // window.localStorage.setItem('user', JSON.stringify(newUser));
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Topbar />
            <div className="profile">
                <Leftbar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img className="profileCoverImg" src={user.coverPicture ? PF + user.coverPicture : PF + "soldier_icon.png"} alt="" />
                            <img className="profileUserImg" src={user.profilePicture ? PF + user.profilePicture : PF + "soldier_icon.png"} alt="" onClick={uploadUserImg} />
                            {profileManipulation && (
                                <input style={{display: "none"}} type="file" id="file" accept=".png,.jpg,jpeg" onChange={(e) => setFile(e.target.files[0])} ref={userImgIcon} />
                            )}
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName" >{user.username}</h4>
                            {saveChangesVisibility && (
                                <button className="saveChangesButton" onClick={submit}>Save Changes</button>
                            )}
                            <span className="profileInfoDescription" >{user.description}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username} />
                        <Rightbar user={user}/>
                    </div>
                </div>
            </div>
        </>
    )
}