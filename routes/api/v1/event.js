'use strict';

const router = require('express').Router();
const Event = require('../../../models/Event');
const User = require('../../../models/User');
const path = require('path');
const multer = require('multer');
const {body,validationResult} = require('express-validator');
const jwtAuth = require('../../../lib/jwtAuth');
const jwtAuthOptional = require('../../../lib/jwtAuthOptional');
const i18n = require('../../../lib/i18nConfigure');
const storage = multer.diskStorage({
  destination : './public/images/photoEvent',
  filename: (req,file,cb) =>{
      cb(null, Date.now() +'-'+file.originalname);
  }
});

const upload = multer({
  storage,
  dest: './public/images/photoEvent',
  limits: {fileSize: 1000000},
  fileFilter: (req,file,cb) =>{
      const ext = path.extname(file.originalname).toLowerCase();
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return cb(new Error(i18n.__('Only images are allowed: .png|.jpg|.gif|.jpeg')));
      }
      cb(null, true);
  },
}).single('photo');

/* GET events . */
router.get('/',jwtAuthOptional, async function (req, res, next) {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const sort = req.query.sort ==='asc' ? 1 : -1;
    const filters = { date: { '$gte': new Date(Date.now())}};
    const lat = req.query.lat? Number(req.query.lat):null;
    const long = req.query.long? Number(req.query.long):null;
    const distance_m = req.query.distance_m? Number(req.query.distance_m):null;
    const userName = req.query.userName?req.query.userName:null;
    
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i');
    }
    if (req.query.description) {
      filters.description = new RegExp(req.query.description, 'i');
    }

    if (req.query.indoor) {
      const myBool = (req.query.indoor.toLowerCase() === 'true');
      filters.indoor = myBool;
    }
    
    if (req.query.tags) {
      let tagsArr;
      if (!Array.isArray(req.query.tags)){
          tagsArr = req.query.tags.split(',');
      } else {
          tagsArr = req.query.tags;
      }
      filters.tags = {$in: tagsArr};
    }

    if (typeof req.query.price !== 'undefined' && req.query.price !== '-') {
      if (req.query.price.indexOf('-') !== -1) {
        filters.price = {};
        let range = req.query.price.split('-');
        if (range[0] !== '') {
          filters.price.$gte = Number(range[0]);
        }
  
        if (range[1] !== '') {
          filters.price.$lte = Number(range[1]);
        }
      } else {
        filters.price = Number(req.query.price);
      }
    }
    if (userName){
      //First we verify that the user exists
      const usrExist = await User.existsUserName(userName);
      if (usrExist > 0){
        const userN = await User.userByName(userName);
        const {_id} = userN;
        if (_id){
         filters._id_owner = _id;
        }
      }else{
        const error = new Error(i18n.__("User not exists"));
        error.status = 404;
        next(error);
        //throw new Error(i18n.__("User not exists"))
      }
    }
    
    const authenticate = req.apiAuthUserId ? req.apiAuthUserId:'';
    const {rows} = await Event.list(filters, skip, limit, sort, authenticate,lat,long,distance_m);
    const resultEnd = rows[0];
    const {total,result} = resultEnd;
    const count = total.length>0?total[0].count:0;
    res.json({ total:count, events: result });

  } catch (error) { 
    next(error);
  }
});


//Get one event by _id with basic data +++++++++ Not documented +++++++++++
router.get('/:_id',jwtAuthOptional, async function (req, res, next) {
  try {
    const _id = req.params._id;

    const event = await Event.findOne({_id:_id});

    if (!event) {
      res.status(404).json({ error: 'not found' });
      return;
    } else {
      res.json({ event });
    }

  } catch (error) { 
    next(error);
  }
});

//Get one event by _id with data calculated and populate data owner event.
router.get('/event/:_id',jwtAuthOptional, async function (req, res, next) {
  try {
    const eventId = req.params._id;
    const lat = req.query.lat? Number(req.query.lat):null;
    const long = req.query.long? Number(req.query.long):null;
    const authenticate = req.apiAuthUserId ? req.apiAuthUserId:'';
    const event = await Event.listOne(authenticate,eventId,lat,long);
    const resultEnd = event[0];
    const {result} = resultEnd;
    return res.status(200).json({event: result[0]});

  } catch (error) { 
    next(error);
  }
});


router.post('/', jwtAuth, upload,[
  body('title').not().isEmpty().trim().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The title is required', { value, location, path });
    }
    ),
  body('price').not().isEmpty().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The price is required', { value, location, path });
    }
    ),
  body('price').optional().isNumeric().isFloat({ min: 0, max: 999 }).escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The price must be numeric and values between 0 & 999', { value, location, path });
    }
    ),
  body('indoor').isBoolean().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The indoor is required and must be boolean', { value, location, path });
    }
    ),
  body('max_places').optional().isNumeric().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The max_places must be numeric', { value, location, path });
    }
    ),
  body('date').not().isEmpty().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The date is required', { value, location, path });
    }
    ),
  body('duration').isNumeric().isFloat({ min: 0.1, max: 999.99 }).escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The duration must be numeric between 0.1 & 999.99', { value, location, path });
    }
    ),
  body('tags').isString().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The tag is required', { value, location, path });
    }
    ),
  // eslint-disable-next-line no-unused-vars
  body('date').optional().custom((date)=>{
    //TODO
      return true;
  }).escape().withMessage(
    (value, { req, location, path }) => {
        return req.__('the date must be higher than now', { value, location, path });
      }
    ),
    //TODO
//   body('tags').custom(tags => {   
//     //Validamos si los tags que nos pasan est??n dentro de los permitidos
//     const errorTags = Event.allowedTagsEnumValidate(tags)

//     //Si alguno de los tags no se encuentra, lanzaremos un error indicando que tags no son admitidos
//     if (errorTags.length > 0){
//         throw new Error(`Tags no admitidos: ${errorTags}`);
//     } else {
//         return true}
// })
    
], async (req, res, next) => {

  try {
    i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en');
    const { title, price, date, duration, indoor, address, city, postal_code, country, tags } = req.body;

    const description = req.body.description ? req.body.description : '';
    const max_places = req.body.max_places ? req.body.max_places : 0;
    const latitude = req.body.latitude ? req.body.latitude :40.41718066151606;
    const longitude = req.body.longitude ? req.body.longitude : -3.7034247438511265;
    const coordinates = (longitude>180.0 ||  longitude<-180.0)  && (latitude>90.0 || latitude<-90.0) ? []:[longitude,latitude];
    const namePhoto = req.file ? req.file.filename :'dei.png';
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg});
    }
    
    const event = new Event({title, description, price, max_places, date, duration, indoor,address, city, postal_code, country,tags, 
                            photo: namePhoto, location: {
                              type: 'Point',
                              coordinates: coordinates
                            }});
  
    // eslint-disable-next-line no-unused-vars
    const saveResult = await event.save();
   
    //Insert register in _id_owner
    // eslint-disable-next-line no-unused-vars
    const addId = await Event.add_id_owner (req.apiAuthUserId,event._id);
   
    res.status(201).json({ result: event});    
  } catch (error) {
    next(error);
  }


});


router.delete('/:_id', jwtAuth, async (req, res, next) => {
  try {
    const { _id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(_id);

    if (!deletedEvent) {
      res.status(404).json({ error: 'not found' });
      return;
    } {
      const {_id} = deletedEvent;
      res.status(201).json({result:_id});
    }

  } catch (error) {
    next(error);
  }

});


router.put('/:_id', jwtAuth, upload,[
  body('title').optional().not().isEmpty().trim().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The title is required', { value, location, path });
      }
  ),
  body('price').optional().isNumeric().isFloat({ min: 0, max: 999 }).escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The price must be numeric and values between 0 & 999', { value, location, path });
    }
  ),
  body('indoor').optional().isBoolean().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The indoor is required and must be boolean', { value, location, path });
    }
  ),
  body('max_places').optional().isNumeric().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The max_places must be numeric', { value, location, path });
    }
    ),
  body('date').optional().not().isEmpty().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The date is required', { value, location, path });
    }
    ),
  body('duration').optional().isNumeric().isFloat({ min: 0.1, max: 999.99 }).escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The duration must be numeric between 0.1 & 999.99', { value, location, path });
    }
    ),
  body('tags').optional().isString().escape().withMessage(
    (value, { req, location, path }) => {
      return req.__('The tag is string required', { value, location, path });
    }
    ),
], async(req, res, next) => {

  try {
    const { _id } = req.params;
    i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en');
    
    const latitude = req.body.latitude ? req.body.latitude : 200;
    const longitude = req.body.longitude ? req.body.longitude : 200;
    const coordinates = (longitude>180.0 ||  longitude<-180.0)  && (latitude>90.0 || latitude<-90.0) ? []:[longitude,latitude];
    const namePhoto = req.file ? req.file.filename :'';

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg});
    }
  
    const isOwnOrAdmin = await Event.existsIdUserOwner(req.apiAuthUserId,_id);

    //This operation can only be performed by the event owner or a super administrator
    if(isOwnOrAdmin>0 || req.apiAuthUserRole === 9){
      const updatedEvent = await Event.updateEvent(_id,req.body,namePhoto,coordinates);
    
      if (!updatedEvent) {
        res.status(404).json({ error: 'not found' });
        return;
      }
    
      res.status(201).json({ result: updatedEvent });
    
    }else{
      const error = new Error(i18n.__('The user does not have privileges for this action'));
      error.status = 401;
      next(error);
      
    }
     
  } catch (error) {
    next(error);
  }

});

module.exports = router;
