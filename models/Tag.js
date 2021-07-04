'use strict'

const mongoose = require('mongoose');


const tagSchema = mongoose.Schema({
    name: {type: String, unique: true, index: true,required: true}
});


const Tag = mongoose.model('Tag', userSchema);

module.exports = Tag;