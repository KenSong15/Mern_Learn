/*this module is going to handle all activity about
    profile, like change description, avatar etc.
*/

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const request = require("request");
const config = require("config");
const {check, validationResult} = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

//@route:   GET api/profile/me
//@desc:    get current user's profile
//@access:  private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate(
            "user",
            ["name", "avatar"]
        );

        if (!profile) {
            return res
                .status(400)
                .json({msg: "There is no profile for this user"});
        }
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error by get current profile");
    }
});

//@route:   POST api/profile/me
//@desc:    create or update a user's profile
//@access:  private
router.post("/", [
    auth, //this is the way to fire multiple validator
    [
        check("status", "Status is required")
            .not()
            .isEmpty(),
        check("skills", "Skills is required")
            .not()
            .isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills
                .split(",")
                .map(skills => skills.trim());
        }
        console.log(profileFields.skills);

        //build social object
        profileFields.social = {}; //define it in advance
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        try {
            let profile = Profile.findOne({user: req.user.id});
            if (profile) {
                // if the profile found, we update it
                //update
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true, upsert: true}
                );

                res.json(profile);
            } else {
                //create
                profile = new Profile(profileFields);
                await profile.save();

                res.json(profile);
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error by create and update profile");
        }

        res.send("simple response");
    }
]);

//@route:   GET api/profile/
//@desc:    get all profiles
//@access:  public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", [
            "name",
            "avatar"
        ]);
        res.json(profiles);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by get all profile");
    }
});

//@route:   GET api/profile/user/:user_id
//@desc:    get profile by user id
//@access:  public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.params.user_id
        }).populate("user", ["name", "avatar"]);

        if (!profile)
            return res
                .status(400)
                .json({msg: "There is no profile for this user"});
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind == "ObjectId") {
            return res.status(400).json({msg: "Profile not found"});
        }
        res.status(500).send("Server error by find by specific");
    }
});

//@route:   DELETE api/profile/
//@desc:    delete profile, user and posts
//@access:  private
router.delete("/", auth, async (req, res) => {
    try {
        //remove profile
        await Profile.findOneAndRemove({user: req.user.id});

        //remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: "User deleted"});

        //todo: remove user's post
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by delete");
    }
});

//@route:   PUT api/profile/experience
//@desc:    add profile experience
//@access:  private
router.put(
    "/experience",
    [
        auth,
        [
            check("title", "Title is required")
                .not()
                .isEmpty(),
            check("company", "Company is required")
                .not()
                .isEmpty(),
            check("from", "From-date is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        } //checking the fields are validated

        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body; //defind the attribute of req body

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }; //make a new object to hold input

        try {
            const profile = await Profile.findOne({user: req.user.id});

            profile.experience.unshift(newExp);

            await profile.save();

            res.json(profile); //return the whole profile to
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error by experence");
        }
    }
);

//@route:   DELETE api/profile/experience/:exp_id
//@desc:    delete experience from profile
//@access:  private
router.delete("/experience/:exp_id", auth, async (req, res) => {
    try {
        //get the profile first
        const profile = await Profile.findOne({user: req.user.id});

        //get the remove index
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1); //take it out
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by delete experience");
    }
});

//@route:   PUT api/profile/education
//@desc:    add profile education
//@access:  private
router.put(
    "/education",
    [
        auth,
        [
            check("school", "School is required")
                .not()
                .isEmpty(),
            check("degree", "Degree is required")
                .not()
                .isEmpty(),
            check("fieldofstudy", "Field of study is required")
                .not()
                .isEmpty(),
            check("from", "From-date is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        } //checking the fields are validated

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body; //defind the attribute of req body

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        }; //make a new object to hold input

        try {
            const profile = await Profile.findOne({user: req.user.id});

            profile.education.unshift(newEdu);

            await profile.save();

            res.json(profile); //return the whole profile to
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error by education");
        }
    }
);

//@route:   DELETE api/profile/education/:edu_id
//@desc:    delete education from profile
//@access:  private
router.delete("/education/:edu_id", auth, async (req, res) => {
    try {
        //get the profile first
        const profile = await Profile.findOne({user: req.user.id});

        //get the remove index
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1); //take it out
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error by delete education");
    }
});

//@route:   GET api/profile/github/:username
//@desc:    get user repos from github
//@access:  public
router.get("/github/:username", (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${
                req.params.username
            }/repos?per_page=5&sort=created:asc&client_id=${config.get(
                "githubClientId"
            )}&client_secret=${config.get("githubSecret")}`,
            method: "GET",
            headers: {"user-agent": "node.js"}
        };

        request(options, (error, response, body) => {
            if (error) console.error(error);

            if (response.statusCode != 200) {
                return res.status(404).json({msg: "No Github profile found"});
            }

            res.json(JSON.parse(body));
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error from read github");
    }
});

module.exports = router;
