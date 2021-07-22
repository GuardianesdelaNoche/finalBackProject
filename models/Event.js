'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./User');
const eventsOwn = require('../lib/eventsOwn');
const eventsFavorite = require('../lib/eventsFavorite');

const eventSchema = mongoose.Schema({
    title: {type: String, index: true, required: true},
    description: {type:String, index: true},
    price: {type:Number, index: true, required: true},
    max_places: {type:Number, index: true},
    date: {type: Date, index: true, required: true},
    duration: { type: Number, index: true, required: true},
    photo: {type:String, index: true},
    indoor: {type:Boolean, index:true, required: true},
    location: {
      type: {type: String},
      coordinates: [Number]
    },
    tags: [String],
    _id_assistants:[{ type: Schema.Types.ObjectId, ref: 'User' }],
    _id_owner:[{type: Schema.Types.ObjectId, ref: 'User',index:true}],
    _id_favorite: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

eventSchema.index({ "location": "2dsphere" });

eventSchema.statics.createRecord = function (nuevo, cb) {
    new Event(nuevo).save(cb)
  }
  
eventSchema.statics.list = async function (filters, startRow, numRows, sortField, includeTotal, cb) {
 
    const query = Event.find(filters)
    
    query.sort(sortField)
    query.skip(startRow)
    query.limit(numRows)

    const result = {}
  
    result.rows = await query.exec()
  
    if (includeTotal) {
      result.total = await query.count()
    }

    if (cb) return cb(null, result) // si me dan callback devuelvo los resultados por ahí
    return result // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
}



//Search own events with paginate
eventSchema.statics.findOwnEventsPaginate = function(req){
  const aggregteOwn = eventsOwn(req)

  const findEvents = Event.aggregate(aggregteOwn).
  exec()

  return findEvents
}

//Search a favorite events

eventSchema.statics.findFavoriteEventsPaginate = function(req){
  const aggregteFavorite = eventsFavorite(req)

  const findEvents = Event.aggregate(aggregteFavorite).
  exec()

  return findEvents
}

  
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;