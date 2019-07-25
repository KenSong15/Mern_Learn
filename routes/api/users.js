/*this module is going to handle all activity about
    users, like sign up, etc.
*/

const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator/check");

//@route:   GET api/users
//@desc:    Test route
//@access:  public (do not need a token to fire this route)
router.get("/", (req, res) => res.send("User router"));

//@route:   POST api/users
//@desc:    register user
//@access:  public (do not need a token to fire this route)
router.post(
  "/",
  [
    // this is the validation about empty name, valid email, long enrough password
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password wit 6 or more characters"
    ).isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req); // catch all possible error
    if (!errors.isEmpty()) {
      // send back a bad response and show error array
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);

    res.send(req.body);
  }
);

module.exports = router;
