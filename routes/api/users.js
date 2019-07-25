/*this module is going to handle all activity about
    users, like sign up, etc.
*/
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//import the model
const User = require("./../../models/User");

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
  async (req, res) => {
    const errors = validationResult(req); // catch all possible error
    if (!errors.isEmpty()) {
      // send back a bad response and show error array
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // see if users exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] }); //do this formatting to match the error message format
      }

      //get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm"
      }); //setting up the avatar image property
      user = new User({
        name,
        email,
        avatar,
        password
      });
      //only making the user model but not actually saving it
      //and the password is not encrypted yet

      //encrypt password
      const salt = await bcrypt.genSalt(10); //declear the level of encrypt
      user.password = await bcrypt.hash(password, salt); //encrypt the password
      await user.save(); //save the user to DB

      //return jsonwebtoken

      //res.send("User registered");
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 36000000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
