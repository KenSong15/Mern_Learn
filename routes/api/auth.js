/*this module is going to handle all activity about
    authentication, like log in, etc.
*/

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@route:   GET api/auth
//@desc:    Test route
//@access:  private (need a valid token to fire this route)
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
