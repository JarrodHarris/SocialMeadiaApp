import React from 'react'
import "./topbar.css"
import { Search, Person, Chat, Notifications } from "@material-ui/icons"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from '../../context/AuthContext'
import axios from "axios"

export default function Topbar() {

    const {user} = React.useContext(AuthContext);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const username = React.useRef();
    const navigate = useNavigate();

    const dropdownRef = React.useRef(null);
    const [dropdownVisibility, setDropdownVisibility] = React.useState(false);
    const triggerDropdown = () => setDropdownVisibility(!dropdownVisibility);

    const searchForUser = async (e) => {
        try {
            var key = e.key;
            if(key === "Enter") {
                const userExists = await axios.get("/users/check/" + username.current.value);
                if(userExists) {
                    navigate("/profile/" + username.current.value);
                }
        }    
        } catch (error) {
            console.log(error);
        }
        
    }

    const logout = async () => {
        try {
            localStorage.clear();   // clears user from localhost memory    
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to='/' style={{textDecoration: "none"}}>
                    <span className="logo">JarrodSocial</span>
                </Link>
            </div>
            <div className="topbarCenter">
               <div className="searchbar">
                    <Search className="searchIcon" />
                    <input placeholder="Search for Friends, Post or Video" className="searchInput" onKeyUp={(e) => searchForUser(e)} ref={username} />
                </div> 
            </div>
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="tobarLink">Homepage</span>
                    <span className="tobarLink">Timeline</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconItem">
                        <Person />
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconItem">
                        <Chat />
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">1</span>
                    </div>
                </div>


                <div className="dropdown">
                    <img src={user.profilePicture ? PF + user.profilePicture : PF + "soldier_icon.png"} alt="" className="topbarImg" onClick={triggerDropdown} />
                    <nav ref={dropdownRef} className={`menu ${dropdownVisibility ? `active` : `inactive`}`}>
                        <ul>
                            <li><a href={`/profile/${user.username}`}>Profile</a></li>
                            <hr />
                            <li onClick={logout}><a href={`/login`}>Logout</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}