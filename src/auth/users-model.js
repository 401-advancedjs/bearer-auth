'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./role-model.js');

const TOKEN_LIFETIME = process.env.EXPIRESIN || '30m';
const SINGLE_USE_TOKEN = !!process.env.SINGLE_USE_TOKEN;
const SECRET = process.env.SECRET || 'changeIt';
const disabledTokens = new Set();

const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','editor','user']},
});

users.virtual('roleSchema', {
  ref: 'roleSchema',
  localField: 'role',
  foreignField: 'capabilites',
});

const capabilities = {
  admin: ['create', 'read', 'update', 'delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};

users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(console.error);
});

users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};

users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};

users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      console.log('Welcome Back', user.username);
      return user;
    })
    .catch( error => {
      console.log('Creating new user');
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};

users.methods.generateToken = function(type) {
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };
  const tokenOption = {};
  if(type !== 'key' && !!TOKEN_LIFETIME){
    tokenOption.expiresIn = TOKEN_LIFETIME;
  }
  return jwt.sign(token, SECRET, tokenOption);
};

users.statics.authenticateToken = function(token){
  if(disabledTokens.has(token)){
    return Promise.reject('Invalid Token');
  }
  try{
    const decryptedToken = jwt.verify(token, SECRET);
    if(SINGLE_USE_TOKEN && decryptedToken.type != 'key'){
      disabledTokens.add(token);
    }
    const query = {_id: decryptedToken.id};
    return this.findOne(query);
  }catch(error){
    throw new Error('Invalid Token');
  }
};

users.methods.generateKey = function(){
  return this.generateToken('key');
};

users.methods.can = function(capability){
  return capabilities[this.role].includes(capability);
};

module.exports = mongoose.model('users', users);
