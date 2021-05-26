const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const User = require("../../models/User");

// @ route    POST api/users
// @ desc     Test route
// @ access   Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "please check email valid").not().isEmpty(),
    check(
      "password",
      "please enter a password with 6 ro more chracters"
    ).isLength({ min: 6 }),
    //.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i" instead isLength
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //erros.array() will make array like {"errors":[{},{}]}
      return res.status(400).json({ errors: errors.array() });
    }

    //req.body has user informaion as a object.
    const { name, email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      //get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //encrypy password using bcrypt
      //if i dont use asyc wait, I have to use .then .then .then
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      //return jsonwebtoken
      const payload = {
        user: {
          id: user._id,
        },
      };
      //congif.get from npm i config and require("../../config/default.json")
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      //   res.send("User registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
