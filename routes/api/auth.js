/*this module is going to handle all activity about
    authentication, like log in, etc.
*/

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const {check, validationResult} = require("express-validator");

//@route:   GET api/auth
//@desc:    Test route
//@access:  private (need a valid token to fire this route)
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error from basic authentication");
    }
});

//@route:   POST api/auth
//@desc:    authenticate user and get token
//@access:  public
router.post(
    "/",
    [
        // this is the validation about empty name, valid email, long enrough password

        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists()
    ],
    async (req, res) => {
        const errors = validationResult(req); // catch all possible error
        if (!errors.isEmpty()) {
            // send back a bad response and show error array
            return res.status(400).json({errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            // see if users exists
            let user = await User.findOne({email});
            if (!user) {
                return res
                    .status(400)
                    .json({errors: [{msg: "Invalid credentials"}]}); //do this formatting to match the error message format
            }

            //conpare the user name and password----------------------------------------
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res
                    .status(400)
                    .json({errors: [{msg: "Invalid credentials"}]});
            }

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
                {expiresIn: 36000000},
                (err, token) => {
                    if (err) throw err;
                    res.json({token});
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
