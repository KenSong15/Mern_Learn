/*this module is going to handle all activity about
    profile, like change description, avatar etc.
*/

const express = require("express");
const router = express.Router();

//@route:   GET api/profile
//@desc:    Test route
//@access:  public (do not need a token to fire this route)
router.get("/", (req, res) => res.send("Profile router"));

module.exports = router;
