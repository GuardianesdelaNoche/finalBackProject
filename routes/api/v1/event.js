'use strict'

const router = require('express').Router();
const Event = require('../../../models/Event');
const path = require('path');
const multer = require('multer');
const {body,validationResult} = require('express-validator');



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

    if (req.query.tags) {
      filters.tags = { $in: req.query.tags };
    }

    if (typeof req.query.price !== 'undefined' && req.query.price !== '-') {
      if (req.query.price.indexOf('-') !== -1) {
        filters.price = {}
        let range = req.query.price.split('-')
        if (range[0] !== '') {
          filters.price.$gte = range[0]
        }
  
        if (range[1] !== '') {
          filters.price.$lte = range[1]
        }
      } else {
        filters.price = req.query.price
      }
    }
  
   
    const {total, rows} = await Event.list(filters, skip, limit, sort, includeTotal)
    res.json({ total, events: rows })
  } catch (error) { 
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }
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

  } catch (error) { 
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }
})

router.post('/', upload,[
  body('title').not().isEmpty().trim().escape().withMessage('The title is required'),
  body('price').not().isEmpty().withMessage('The price is required'),
  body('price').optional().isNumeric().withMessage('The price must be numeric'),
  body('indoor').not().isEmpty().withMessage('The indoor is required'),
  body('indoor').optional().not().isNumeric().withMessage('The indoor must be boolean'),
  body('max_places').optional().isNumeric().withMessage('The max_places must be numeric'),
  body('date').not().isEmpty().withMessage('The date is required'),
  body('duration').not().isEmpty().trim().withMessage('The duration is required'),
  body('duration').optional().isNumeric().withMessage('The duration must be numeric'),
  body('tags').not().isEmpty().trim().withMessage('The tag is required'),
  body('tags').optional().not().isNumeric().withMessage('The tag must be a string'),
], async (req, res, next) => {

  try {
    const { title, price, date, duration, indoor, address, city, postal_code, country, tags } = req.body;

    const description = req.body.description ? req.body.description : '';
    const max_places = req.body.max_places ? req.body.max_places : 0;
    const latitude = req.body.latitude ? req.body.latitude :200
    const longitude = req.body.longitude ? req.body.longitude : 200
    const coordinates = (longitude>180.0 ||  longitude<-180.0)  && (latitude>90.0 || latitude<-90.0) ? []:[longitude,latitude]
    const namePhoto = req.file ? req.file.filename :'';
  
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array()});
    }
    
    if (price < 0) {
      return res.status(500).json({message: "The price cannot be lower than 0"})
    }

    if (price >= 999) {
      return res.status(500).json({message: "The price cannot be higher than 999 "})
    }

    if (duration <= 5) {
      return res.status(500).json({message: "The price cannot be lower than or equal 5"})
    }

    if (duration >= 99) {
      return res.status(500).json({message: "The price cannot be higher than 99"})
    }

    const event = new Event({title, description, price, max_places, date, duration, indoor,address, city, postal_code, country,tags, 
                            photo: namePhoto, location: {
                              type: 'Point',
                              coordinates: coordinates
                            }})
  
    await event.save();
  
    res.status(201).json({ result: event});    
  } catch (error) {
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: error.errors ? error._message : errorModify });
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
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }

});

router.put('/:_id', upload,[
  body('title').optional().not().isEmpty().trim().escape().withMessage('The title is required'),
  body('price').optional().not().isEmpty().withMessage('The price is required'),
  body('price').optional().isNumeric().withMessage('The price must be numeric'),
  body('indoor').optional().not().isEmpty().withMessage('The indoor is required'),
  body('indoor').optional().not().isNumeric().withMessage('The indoor must be boolean'),
  body('max_places').optional().isNumeric().withMessage('The max_places must be numeric'),
  body('date').optional().not().isEmpty().withMessage('The date is required'),
  body('duration').optional().not().isEmpty().trim().withMessage('The duration is required'),
  body('duration').optional().isNumeric().withMessage('The duration must be numeric'),
  body('tags').optional().not().isEmpty().trim().withMessage('The tag is required'),
  body('tags').optional().not().isNumeric().withMessage('The tag must be a string'),
], async(req, res, next) => {

  try {
    const { _id } = req.params;
    const { title, price, date, duration, indoor, address, city, postal_code, country , tags } = req.body;

    const description = req.body.description ? req.body.description : '';
    const max_places = req.body.max_places ? req.body.max_places : 0;
    const namePhoto = req.file ? req.file.filename :'';
    const latitude = req.body.latitude ? req.body.latitude : 200
    const longitude = req.body.longitude ? req.body.longitude : 200
    const coordinates = (longitude>180.0 ||  longitude<-180.0)  && (latitude>90.0 || latitude<-90.0) ? []:[longitude,latitude]
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).json({errors: errors});
    }

    if (price < 0) {
      return res.status(500).json({message: "The price cannot be lower than 0"})
    }

    if (price >= 999) {
      return res.status(500).json({message: "The price cannot be higher than 999 "})
    }

    if (duration <= 5) {
      return res.status(500).json({message: "The price cannot be lower than or equal 5"})
    }

    if (duration >= 99) {
      return res.status(500).json({message: "The price cannot be higher than 99"})
    }
  
    const updatedEvent = await Event
    .findByIdAndUpdate(
      _id, 
      {$set: req.body},
      { useFindAndModify: false} )
    
    if (!updatedEvent) {
      res.status(404).json({ error: 'not found' });
      return;
    }
  
    res.status(200).json({ result: updatedEvent });
  
  } catch (error) {
    const errorModify = error.toString().split(':')[1].trim();
    return res.status(500).json({ message: errorModify });
  }

})

module.exports = router
