'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: {type: String, unique: true},
    password: String
});

userSchema.statics.hashPassword = function(passwordOriginal){
    return bcrypt.hash(passwordOriginal, 10);
}

userSchema.methods.comparePassword = function(passwordOriginal){
    return bcrypt.compare(passwordOriginal, this.password);
}

const User = mongoose.model('User', userSchema);

module.exports = User;