'use strict'

const router = require('express').Router();
const Event = require('../../../models/Event');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination : './public/images/photoEvent',
  filename: (req,file,cb) =>{
      cb(null, Date.now() +'-'+file.originalname);
  }
});

const upload = multer({
  storage,
  dest: './public/images/photoEvent',
  limits: {fileSize: 1 * 10000 * 10000},
  fileFilter: (req,file,cb) =>{
      const ext = path.extname(file.originalname).toLowerCase();
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return cb(new Error('Only images are allowed: .png|.jpg|.gif|.jpeg'))
      }
      cb(null, true)
  },
}).single('photo')

/* GET events . */
router.get('/', async function (req, res, next) {
  try {
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10
    const sort = req.query.sort || 'date'
    const includeTotal = true

    const filters = { date: { '$gte': new Date(Date.now())}}
    
    if (req.query.title) {
      filters.title = new RegExp('^' + req.query.title, 'i')
    }
    if (req.query.indoor) {
      filters.indoor = req.query.indoor
    }
   
    const {total, rows} = await Event.list(filters, skip, limit, sort, includeTotal)
    res.json({ total, events: rows })
  } catch (err) { return res.next(err) }
})

router.get('/:_id', async function (req, res, next) {
  try {
    const _id = req.params._id;

    const event = await Event.findOne({_id:_id})

    if (!event) {
      res.status(404).json({ error: 'not found' })
      return;
    } else {
      res.json({ event })
    }

  } catch (err) { 
    return res.next(err) 
  }
})

router.post('/', upload, async (req, res, next) => {

  try {
    const {title, description, price, max_places, date, duration, indoor, tags, _id_assistants} = req.body;

    const latitude = req.body.latitude ? req.body.latitude : 0
    const longitude = req.body.longitude ? req.body.longitude : 0
    const coordinates = latitude<0 && longitude<0 ? [longitude,latitude] :[]
    const namePhoto = req.file ? req.file.filename :'';
  
    
    const event = new Event({title, description, price, max_places, date, duration, indoor, tags, _id_assistants, 
                            photo: namePhoto, location: {
                              type: 'Point',
                              coordinates: coordinates
                            }})
  
    await event.save();
  
    res.status(201).json({ result: event});    
  } catch (error) {
    return next(error);
  }


});

router.delete('/:_id', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(_id);

    if (!deletedEvent) {
      res.status(404).json({ error: 'not found' })
      return;
    } {
      res.status(200).json(`${deletedEvent._id} deleted`);
    }

  } catch (error) {
    next(error);
  }

});
module.exports = router
