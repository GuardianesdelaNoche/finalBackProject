'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
//const User = require('./User');
// const eventsOwn = require('../lib/eventsOwn');
// const eventsFavorite = require('../lib/eventsFavorite');
// const eventsAssistant = require('../lib/eventsAssistant')
const eventsByUser = require('../lib/eventsByUser');
const eventsAll = require('../lib/eventsAll');
const eventsOne = require('../lib/eventsOne');

const eventSchema = mongoose.Schema({
    title: {type: String, index: true, required: true},
    description: {type:String, index: true},
    price: {type:Number, index: true, default: 0},
    max_places: {type:Number, index: true, default:0},
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
    _id_assistants:[{ type: Schema.Types.ObjectId, ref: 'User',index:true }],
    _id_owner:[{type: Schema.Types.ObjectId, ref: 'User',index:true}],
    _id_favorite: [{ type: Schema.Types.ObjectId, ref: 'User',index:true }],
});

eventSchema.index({ "location": "2dsphere" });

eventSchema.statics.createRecord = function (nuevo, cb) {
    new Event(nuevo).save(cb);
  };
  
eventSchema.statics.list = async function (filters, startRow, numRows, sortField, authenticate,latitude,longitude,distance,cb) {
  const result = {};
  const aggregteAll = eventsAll(filters, startRow, numRows, sortField, authenticate,latitude,longitude,distance);
  const query = Event.aggregate(aggregteAll);
  result.rows = await query.exec();
  if (cb) return cb(null, result); // si me dan callback devuelvo los resultados por ahí
  return result; // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
};

//List one Event by Id and aggregate ans populate with users
eventSchema.statics.listOne = function (authenticate,eventId,latitude,longitude) {
  const aggregteOne = eventsOne(authenticate,eventId,latitude,longitude);
  const query = Event.aggregate(aggregteOne).exec();
  
  return query;
};

//Event exists
eventSchema.statics.existsOne = function (eventId) {
  const query = Event.countDocuments({_id:eventId}).exec();
  
  
  return query;
};

//Search own events with paginate
eventSchema.statics.findOwnEventsPaginate = async function(req){

  const result = {};

  const aggregteOwn = eventsByUser(req);

  const findEvents = Event.aggregate(aggregteOwn);

  result.rows = await findEvents.exec();

  return result;
};

//Search a favorite events

eventSchema.statics.findFavoriteEventsPaginate = async function(req){

  const result = {};

  const aggregteFavorite = eventsByUser(req);

  const findEvents = Event.aggregate(aggregteFavorite);

  result.rows = await findEvents.exec();


  return result;
};

//Search assistants
eventSchema.statics.findAssistantsEventsPaginate = async function(req){
  const result = {};

  const aggregteAssistant = eventsByUser(req);

  const findEvents = Event.aggregate(aggregteAssistant);

  result.rows = await findEvents.exec();

  return result;
};


//Add new User _id in _id_assistants
eventSchema.statics.add_id_assistant = function(idUser,idEvent){
    const updateAssistants =  Event.findByIdAndUpdate(
        {_id: new mongoose.Types.ObjectId(idEvent) },
        {$addToSet: {_id_assistants: new mongoose.Types.ObjectId(idUser)} },
        {new: true}
    ).exec();
        return updateAssistants;
};

////Delete User _id in _id_assistants
eventSchema.statics.del_id_assistant = function(idUser,idEvent){
    const deleteAssistants =  Event.findByIdAndUpdate(
        {_id: new mongoose.Types.ObjectId(idEvent) },
        {$pull: {_id_assistants: new mongoose.Types.ObjectId(idUser) } },
        {new: true}
    ).exec();
        return deleteAssistants;
};

//Add new User _id in _id_favorite
eventSchema.statics.add_id_favorite = function(idUser,idEvent){
  const updateFavorites =  Event.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(idEvent) },
      {$addToSet: {_id_favorite: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec();
      return updateFavorites;
};

////Delete User _id in _id_favorite
eventSchema.statics.del_id_favorite = function(idUser,idEvent){
  const deleteFavorites =  Event.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(idEvent) },
      {$pull: {_id_favorite: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec();
      return deleteFavorites;
};

//Add new User _id in _id_owner
eventSchema.statics.add_id_owner = function(idUser,idEvent){
  const updateOwner =  Event.findByIdAndUpdate(
      {_id: new mongoose.Types.ObjectId(idEvent) },
      {$addToSet: {_id_owner: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec();

      return updateOwner; 
};


/////////////////When delete a User//////////////
////Delete User/Event _id in _id_owner
eventSchema.statics.del_id_owner = function(idUser){
  //Delete user events
  const deleteOwners =  Event.deleteMany(
      {_id_owner:new mongoose.Types.ObjectId(idUser)}
  ).exec();
      return deleteOwners;
};
////Delete User _id in all _id_favorite
eventSchema.statics.del_id_favorites = function(idUser){
  const deleteAllFavorites =  Event.updateMany(
      {_id_favorite: new mongoose.Types.ObjectId(idUser) },
      {$pull: {_id_favorite: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec();
      return deleteAllFavorites;
};
////Delete User _id in all _id_assistants
eventSchema.statics.del_id_assistants = function(idUser){
  const deleteAllAssistants =  Event.updateMany(
      {_id_assistants: new mongoose.Types.ObjectId(idUser) },
      {$pull: {_id_assistants: new mongoose.Types.ObjectId(idUser) } },
      {new: true}
  ).exec();
      return deleteAllAssistants;
};


//Exists idUser in favorite?
eventSchema.statics.existsIdUserFavorite = function(idUser, idEvent){
  const id = new mongoose.Types.ObjectId(idUser);
  const idEv = mongoose.Types.ObjectId(idEvent);
  const favorites = Event.countDocuments({_id: idEv, _id_favorite: id}).exec();
  return favorites;
};

//Exists idUser in favorite?
eventSchema.statics.existsIdUserAssistant = function(idUser, idEvent){
  const id = new mongoose.Types.ObjectId(idUser);
  const idEv = mongoose.Types.ObjectId(idEvent);
  const assistant = Event.countDocuments({_id: idEv, _id_assistants: id}).exec();
  return assistant;
};

//Exists idUser in owner?
eventSchema.statics.existsIdUserOwner = function(idUser, idEvent){
  const id = new mongoose.Types.ObjectId(idUser);
  const idEv = mongoose.Types.ObjectId(idEvent);
  const assistant = Event.countDocuments({_id: idEv, _id_owner: id}).exec();
  return assistant;
};

//Available Places
//available_places: {$subtract:['$max_places',{$size: '$_id_assistants'}]},
eventSchema.statics.availablePlaces = async function(idEvent){
  const idEv =  mongoose.Types.ObjectId(idEvent);
  const assistant = await Event.findById(idEv);
  const available =  assistant.max_places - assistant._id_assistants.length;
  return available;
};

eventSchema.statics.updateEvent = async function(idEvent,reqValues,namePhoto,coordinates){
  const valUpdate = reqValues;
  const valObject= {};
  
  valUpdate.title ? valObject.title = valUpdate.title:{};
  valUpdate.description ? valObject.description = valUpdate.description:{};
  valUpdate.price ? valObject.price = valUpdate.price:{};
  valUpdate.max_places ? valObject.max_places = valUpdate.max_places:{};
  valUpdate.date ? valObject.date = valUpdate.date:{};
  valUpdate.duration ? valObject.duration = valUpdate.duration:{};
  valUpdate.indoor ? valObject.indoor = valUpdate.indoor:{};
  valUpdate.city ? valObject.city = valUpdate.city:{};
  valUpdate.address ? valObject.address = valUpdate.address:{};
  valUpdate.postal_code ? valObject.postal_code = valUpdate.postal_code:{};
  valUpdate.country ? valObject.country = valUpdate.country:{};
  valUpdate.tags ? valObject.tags = valUpdate.tags:{};
  namePhoto ? valObject.photo = namePhoto:{};
  coordinates.length ? valObject.location = {'coordinates': coordinates, 'type':'Point'}:{};

  const updateEvent = Event.findByIdAndUpdate(
    {_id: idEvent },
    {$set: valObject},
    {new: true}
  ).exec();
  return updateEvent;
};
  
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;