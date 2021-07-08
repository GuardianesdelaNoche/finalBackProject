'use strict';

const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    title: {type: String, index: true, required: true},
    description: {type:String, index: true},
    price: {type:Number, index: true, required: true},
    max_places: {type:Number, index: true},
    date: {type: String, index: true, required: true},
    duration: { type: Number, index: true, required: true},
    photo: {type:String, index: true},
    indoor: {type:Boolean, index:true, required: true},
    long: {type:String, index: true},
    lat: {type:String, index: true},
    tags: [String],
    _id_assistants:[String]
});

eventSchema.statics.createRecord = function (nuevo, cb) {
    new Event(nuevo).save(cb)
  }
  
eventSchema.statics.list = async function (filters, startRow, numRows, sortField, includeTotal, cb) {
    const query = Event.find(filters)
    query.sort(sortField)
    query.skip(startRow)
    query.limit(numRows)

    const result = {}
  
    if (includeTotal) {
      result.total = await Event.count()
    }
    result.rows = await query.exec()
  
    // poner ruta base a imagenes
    //result.rows.forEach(r => (r.foto = r.foto ? path.join(IMAGE_URL_BASE_PATH, r.foto) : null))
  
    if (cb) return cb(null, result) // si me dan callback devuelvo los resultados por ahí
    return result // si no, los devuelvo por la promesa del async (async está en la primera linea de esta función)
}
  
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;