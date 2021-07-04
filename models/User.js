'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, index: true,required: true},
    email: {type: String, unique: true, index: true,required: true},
    address: {type: String, index: true },
    city: {type: String, index: true},
    postal_code: {type: String, index: true},
    country: { type: String, index: true },
    role: {type:Number, index: true,required: true},
    password: {type: String},
    phone: {type: String},
    nickname: {type: String, unique: true, index: true,required: true},
    image: {type: String},
    create_date: { type: Date, index: true },
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

const User = mongoose.model('User', userSchema);

module.exports = User;