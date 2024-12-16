const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //checks the 'userId' that is originally tied to the post to the id that you have given
        if(post.userId === req.body.userId)
        {
            await post.updateOne({$set:req.body});
            res.status(200).json("Post has been updated!");
        }
        else 
        {
            res.status(403).json("you can only update your own post");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //checks the 'userId' that is originally tied to the post to the id that you have given
        if(post.userId === req.body.userId)
        {
            await post.deleteOne();
            res.status(200).json("Post has been deleted successfully!");
        }
        else 
        {
            res.status(403).json("you can only delete posts you own");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// like/dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //if user hasn't previously liked post... add user
        if(!post.likes.includes(req.body.userId)) 
        {
            await post.updateOne({$push: {likes: req.body.userId} })
            res.status(200).json("post has been liked");
        }
        else //if user has liked post before... remove user 
        {
            await post.updateOne({$pull: {likes: req.body.userId} })
            res.status(200).json("post has been disliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

// get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
})

// get timeline posts
// idea of this function is to show posts of user and...
// show 'friends' posts through the user 'followings' 
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id }); //find posts that have the same 'userId' as the user above

        //if you need to loop through an array, need to use promise
        //(or will just return first entry)
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({userId: friendId})
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        res.status(500).json(error);
    }
})

// get current user's posts(executed on profile page)
// based on user's username
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({username:req.params.username});
        const posts = await Post.find({userId: user._id});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;