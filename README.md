![CF](http://i.imgur.com/7v5ASc8.png) LAB
=================================================

## Bearer Authorization

### Author: Melissa Stock

### Links and Resources
* [submission PR](https://github.com/401-advancedjs/bearer-auth/pull/1)
* [travis](https://www.travis-ci.com/)

#### Documentation
* [jwt docs](https://www.npmjs.com/package/jsonwebtoken)

### Modules
#### `middleware.js`
#### `router.js`
#### `users-model.js`
#### `404.js`
#### `error.js`
#### `app.js`

##### Exported Values and Methods

###### `_authBasic(authString) -> object`

###### `_authBearer(authString) -> object`

### Setup
#### `.env` requirements
* `PORT` - Port Number
* `MONGODB_URI` - URL to the running mongo instance/db
* `SECRET` - Used to decode information in db

#### Running the app
* `npm start`
* Endpoint: `/signup`
  * Returns a JSON object with new user in it.
* Endpoint: `/signin`
  * Returns a JSON object with user data in it.
* Endpoint: `/key`
  Return a JSON object with user data in it.
  
#### Tests
* How do you run tests? `npm run test`
* What assertions were made?
  * auth middleware verifies that users and admins can log in
  * auth middleware allows users to sign in with basic and bearer tokens
  * expired tokens do not allow a user to login
  * tokens expire in 15min
  * Auth Keys do not expire
  * Auth keys can login a user as a token would
* What assertions need to be / should be made?
  * single use tokens are not regenerated

#### UML
![authorization uml](./auth-server/assets/uml.jpg)

