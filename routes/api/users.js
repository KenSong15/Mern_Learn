/*this module is going to handle all activity about
    users, like sign up, etc.
*/

const express = require("express");
const router = express.Router();

//@route:   GET api/users
//@desc:    Test route
//@access:  public (do not need a token to fire this route)
router.get("/", (req, res) => res.send("User router"));

module.exports = router;
