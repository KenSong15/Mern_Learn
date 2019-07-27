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
router.get("/", (req, res) => res.send("Post router"));

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

module.exports = router;
