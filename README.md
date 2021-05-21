
npm init
npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request body-parser
npm i -D nodemon concurrently

#run server
npm run server


for the validation
const { check, validationResult } = require("express-validator"); 
[
    check("name", "Name is required")
]
