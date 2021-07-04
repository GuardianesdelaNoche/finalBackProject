'use strict';

const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({
    title: {type: String, index: true},
    description: {type:String, index: true},
    price: {type:Number, index: true},
    max_places: {type:Number, index: true},
    photo: {type:String, index: true},
    indoor: {type:Boolean, index:true},
    tags: [String]
});


const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;