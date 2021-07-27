'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const User = require('./User');
// const eventsOwn = require('../lib/eventsOwn');
// const eventsFavorite = require('../lib/eventsFavorite');
// const eventsAssistant = require('../lib/eventsAssistant')
const eventsByUser = require('../lib/eventsByUser')

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
    address: {type: String, index: true },
    city: {type: String, index: true},
    postal_code: {type: String, index: true},
    country: { type: String, index: true },
    created_date: { type: Date, index: true, default: Date.now },
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

eventSchema.statics.listCount = async function (filters, cb) {
 
  const query = Event.find(filters)
  
  const result = {}

  result.rows = await query.exec()
  result.total = await query.count()

  if (cb) return cb(null, result) // si me dan callback devuelvo los resultados por ahí
  return result // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
}

//Search own events with paginate
eventSchema.statics.findOwnEventsPaginate = function(req){
  const aggregteOwn = eventsByUser(req)

  const findEvents = Event.aggregate(aggregteOwn).
  exec()

  return findEvents
}

//Search a favorite events

eventSchema.statics.findFavoriteEventsPaginate = function(req){
  const aggregteFavorite = eventsByUser(req)

  const findEvents = Event.aggregate(aggregteFavorite).
  exec()

  return findEvents
}

//Search assistants
eventSchema.statics.findAssistantsEventsPaginate = function(req){
  const aggregteAssistant = eventsByUser(req)

  const findEvents = Event.aggregate(aggregteAssistant).
  exec()

  return findEvents
}


//Add new User _id in _id_assistants
eventSchema.statics.add_id_assistants = function(idUser,idEvent){
    const updateAssistants =  Event.findByIdAndUpdate(
        {_id: new mongoose.Types.ObjectId(idEvent) },
        {$addToSet: {_id_assistants: new mongoose.Types.ObjectId(idUser)} },
        {new: true}
    ).exec()
        return updateAssistants
};

////Delete User _id in _id_assistants
eventSchema.statics.del_id_assistants = function(idUser,idEvent){
    const deleteAssistants =  Event.findByIdAndUpdate(
        {_id: new mongoose.Types.ObjectId(idEvent) },
        {$pull: {_id_assistants: new mongoose.Types.ObjectId(idUser) } },
        {new: true}
    ).exec()
        return deleteAssistants
};

//Add new User _id in _id_favorite
eventSchema.statics.add_id_favorite = function(idUser,idEvent){
  const updateFavorites =  Event.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(idEvent) },
      {$addToSet: {_id_favorite: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec()
      return updateFavorites
};

////Delete User _id in _id_favorite
eventSchema.statics.del_id_favorite = function(idUser,idEvent){
  const deleteFavorites =  Event.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(idEvent) },
      {$pull: {_id_favorite: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec()
      return deleteFavorites
};

//Add new User _id in _id_owner
eventSchema.statics.add_id_owner = function(idUser,idEvent){
  const updateOwner =  Event.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(idEvent) },
      {$addToSet: {_id_owner: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec()
      return updateFavorites
};


/////////////////When delete a User//////////////
////Delete User/Event _id in _id_owner
eventSchema.statics.del_id_owner = function(idUser){
  //Delete user events
  const deleteOwners =  Event.deleteMany(
      {_id_owner:new mongoose.Types.ObjectId(idUser)}
  ).exec()
      return deleteOwners
};
////Delete User _id in all _id_favorite
eventSchema.statics.del_id_favorites = function(idUser){
  const deleteAllFavorites =  Event.updateMany(
      {_id_favorite: new mongoose.Types.ObjectId(idUser) },
      {$pull: {_id_favorite: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec()
      return deleteAllFavorites
};
////Delete User _id in all _id_assistants
eventSchema.statics.del_id_assistants = function(idUser){
  const deleteAllAssistants =  Event.updateMany(
      {_id_assistants: new mongoose.Types.ObjectId(idUser) },
      {$pull: {_id_assistants: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec()
      return deleteAllAssistants
};

  
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;