'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Event = require('./Events');
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, index: true,required: true},
    email: {type: String, unique: true, index: true,required: true},
    address: {type: String, index: true },
    city: {type: String, index: true},
    postal_code: {type: String, index: true},
    country: { type: String, index: true },
    role: {type:Number, index: true,required: true},
    password: {type: String, required: true},
    phone: {type: String},
    nickname: {type: String, unique: true, index: true,required: true},
    image: {type: String},
    created_date: { type: Date, index: true, default: Date.now },
    my_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    suscribe_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    fav_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
});

userSchema.statics.hashPassword = function(passwordOriginal){
    return bcrypt.hash(passwordOriginal, 10);
}

userSchema.methods.comparePassword = function(passwordOriginal){
    return bcrypt.compare(passwordOriginal, this.password);
}

userSchema.statics.existsEmail = function(email){
    const isUser = User.count({email: { $regex : new RegExp(email.toLowerCase(), "i") }, deleted:null})
    return isUser.exec()
}

userSchema.statics.existsUserName = function(username){
    const isUserName = User.count({username: { $regex : new RegExp(username.toLowerCase(), "i") }, deleted:null})
    return isUserName.exec()
}

userSchema.statics.existsNickName = function(nickname){
    const isUserNickName = User.count({nickname:{ $regex : new RegExp(nickname.toLowerCase(), "i") }, deleted:null})
    return isUserNickName.exec()
}

const User = mongoose.model('User', userSchema);

module.exports = User;
