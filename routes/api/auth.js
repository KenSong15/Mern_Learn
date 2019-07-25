/*this module is going to handle all activity about
    authentication, like log in, etc.
*/

const express = require("express");
const router = express.Router();

//@route:   GET api/auth
//@desc:    Test route
//@access:  public (do not need a token to fire this route)
router.get("/", (req, res) => res.send("auth router"));

module.exports = router;
