const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const bcrypt = require("bcryptjs");

// @ route    GET api/auth
// @ desc     Test route
// @ access   Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @ route    POST api/auth
// @ desc     Authenticate user & get token
// @ access   Public
router.post(
  "/",
  [
    check("email", "please check email valid"),
    check(
      "password",
      "please enter a password with 6 ro more chracters"
    ).exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //erros.array() will make array like {"errors":[{},{}]}
      return res.status(400).json({ erros: errors.array() });
    }

    //req.body has user informaion as a object.
    const { email, password } = req.body;

    try {
      //see if user exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
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
      //   console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
