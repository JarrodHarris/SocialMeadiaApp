const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update user
router.put("/:id", async (req, res) => {
    //req.user.isAdmin is not defined because user is referenced later down in the code - line 20
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (error) {
                return res.status(500).json(error);
            }
        }
        try {
            //set all the inputs of the user
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json("You can only update your account")
    }
})

//delete user
router.delete("/:id", async (req, res) => {
    //req.user.isAdmin is not defined because user is referenced later down in the code - line 20
    if(req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            //set all the inputs of the user
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted successfully");
        } catch (error) {
            return res.status(500).json(error);
        }
    }
    else {
        return res.status(403).json("You can only delete your account")
    }
})

// get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;

    try {
        //if userId is put in the url, find it that way, otherwise find it through the username
        const user = userId
            ? await User.findById(userId) 
            : await User.findOne({username});

        //filter the response to remove 'password', 'updatedAt' and put filter into 'other'
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);     
    } catch (error) {
        res.status(500).json(error)
    }
})

// retrieve all users
// search for user in database based off username
router.get("/check/:username", async (req, res) => {
    try {
        const user = await User.findOne({username: req.params.username});
        if(user) {
            res.status(200).json(user);
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

//get friends(profile page)
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        // With user, access its followings array,
        // and for each id stored, use it to get the corresponding 'user' objects
        const friends = await Promise.all(
            user.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );

        // get each of the friend's 'user' objects and extract only
        // the _id, username and profilePicture of each object
        // and push it to the new array; friendList
        let friendList = [];
        friends.map((friend) => {
            const {_id, username, profilePicture} = friend;
            friendList.push({_id, username, profilePicture});
        });

        res.status(200).json(friendList);

    } catch (error) {
        res.status(500).json(error);
    }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const userToFollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!userToFollow.followers.includes(req.body.userId)) 
            {
                await userToFollow.updateOne({ $push: { followers: req.body.userId }});
                await currentUser.updateOne({ $push: { followings: req.params.id }});
                res.status(200).json("User has been followed");
            }
            else
            {
                res.status(403).json("You are already following this user")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you cannot follow yourself!")
    }
})

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id) {
        try {
            const userToUnfollow = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(userToUnfollow.followers.includes(req.body.userId)) 
            {
                await userToUnfollow.updateOne({ $pull: { followers: req.body.userId }});
                await currentUser.updateOne({ $pull: { followings: req.params.id }});
                res.status(200).json("User has been unfollowed");
            } 
            else
            {
                res.status(403).json("You are not following this user to begin with")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("you cannot unfollow yourself!")
    }
})

// update profilePicture
router.put("/updateProfilePicture/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        await user.updateOne({profilePicture: req.body.profilePicture});
        res.status(200).json("User's profile picture has been updated");
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;