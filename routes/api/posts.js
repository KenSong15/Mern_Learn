/*this module is going to handle all activity about
    posts, like like and dislike, new post etc.
*/

const express = require("express");
const router = express.Router();

//@route:   GET api/posts
//@desc:    Test route
//@access:  public (do not need a token to fire this route)
router.get("/", (req, res) => res.send("Post router"));

module.exports = router;
