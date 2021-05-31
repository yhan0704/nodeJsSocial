
npm init
npm i express express-validator bcryptjs config gravatar jsonwebtoken mongoose request body-parser
npm i -D nodemon concurrently

#run server
npm run server

node_modules/
config/production.json
config/default.json
client/build
client/.eslintcache

for the validation
const { check, validationResult } = require("express-validator"); 
[
    check("name", "Name is required")
]

for React 
npm i axios react-router-dom redux react-redux redux-thunk redux-devtools-extension moment react-moment uuid

git push heroku HEAD:master