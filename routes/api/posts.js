/*this module is going to handle all activity about
    posts, like like and dislike, new post etc.
*/

const express = require("express");
const router = express.Router();
const {check, validationResult} = require("express-validator");
const auth = require("../../middleware/auth");

//bring in all model
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route:   GET api/posts
//@desc:    Test route
//@access:  public (do not need a token to fire this route)
router.get("/test", (req, res) => res.send("Post router"));

//@route:   POST api/posts
//@desc:    create a post
//@access:  private
router.post(
    "/",
    [
        auth,
        [
            check("text", "Text is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()});
        }

        try {
            const user = await User.findById(req.user.id).select("-password"); //return except password

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            res.json(post); //once we send it we get it back
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error on create a post");
        }
    }
);

//@route:   GET api/posts
//@desc:    get all avaliable post
//@access:  private
router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1});
        res.json(posts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by get all posts");
    }
});

//@route:   GET api/posts/:post_id
//@desc:    get one post refer post id
//@access:  private
router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(404)
                .json({msg: "Post not found, post id invalid"});
        }
        res.json(post);
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res
                .status(404)
                .json({msg: "Post not found, at least give me a post id"});
        }
        res.status(500).send("Server error by get post by id");
    }
});

//@route:   DELETE api/posts
//@desc:    delete one post refer to post id
//@access:  private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res
                .status(404)
                .json({msg: "Post not found, post id invalid"}); //this means that the post does not exist
        }

        //check on user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "User not authorized"});
        }

        await post.remove();

        res.json({msg: "Post removed"});
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res
                .status(404)
                .json({msg: "Post not found, at least give me a post id"});
        }
        res.status(500).send("Server error by delete by id");
    }
});

//@route:   PUT api/posts/like/:id
//@desc:    Like a post
//@access:  Private
router.put("/like/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if this post is already been liked by this user
        if (
            post.likes.filter(like => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res
                .status(400)
                .json({msg: "Post already been like by this user."});
        }

        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by like a post");
    }
});

//@route:   PUT api/posts/unlike/:id
//@desc:    remove Like a post
//@access:  Private
router.put("/unlike/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check if this post is already been liked by this user
        if (
            post.likes.filter(like => like.user.toString() === req.user.id)
                .length === 0
        ) {
            return res
                .status(400)
                .json({msg: "Post has not yet been liked by this user."});
        }

        //get remove index
        const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);

        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by unlike a post");
    }
});

module.exports = router;
