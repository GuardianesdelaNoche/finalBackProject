'use strict';

const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({
    title: {type: String, index: true, required: true},
    description: {type:String, index: true},
    price: {type:Number, index: true, required: true},
    max_places: {type:Number, index: true},
    date: {type: String, index: true, required: true},
    duration: { type: Number, index: true, required: true},
    photo: {type:String, index: true},
    indoor: {type:Boolean, index:true, required: true},
    tags: [String],
    _id_assistants:[String]
});


const Event = mongoose.model('Event', eventsSchema);

module.exports = Event;