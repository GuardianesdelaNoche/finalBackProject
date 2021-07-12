'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');


const User = require('../../../models/User');

const passwordSchema = new pv();
passwordSchema
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().lowercase()
    .has().digits(1);

/**
 * To avoid duplicates, we will rename the image as follows
 * current date + original image name + original extension
 */

 const storage = multer.diskStorage({
    destination : './public/images/photoUser',
    filename: (req,file,cb) =>{
        cb(null, Date.now() +'-'+file.originalname);
    }
});

const upload = multer({
    storage,
    dest: './public/images/photoUser',
    limits: {fileSize: 1 * 10000 * 10000},
    fileFilter: (req,file,cb) =>{
        const ext = path.extname(file.originalname).toLowerCase();
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed: .png|.jpg|.gif|.jpeg'))
        }
        cb(null, true)
    },
}).single('image')




//Get any user by super administrator or own 
router.get('/:id_user?', jwtAuth, async function(req,res,next){
    try {
        const idUser = req.params.id_user ? req.params.id_user:req.apiAuthUserId
        
        if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
            const resultUserId = await User.getUser(idUser)
            const {_id,username,email,address,city,postal_code,country,role,phone,nickname,image,location} = resultUserId;
            return res.status(200).json({result: {_id,username,email,address,city,postal_code,country,role,phone,nickname,image,location}});
        }  else{
            const err = new Error(`The user does not have privileges for this action`);
            err.status = 403
            throw err
        }  
    } catch (error) {
        next(error);
    }
})


//Delete user
router.delete('/:id_user?', jwtAuth, async function(req,res,next){
    try {
        const idUser = req.params.id_user ? req.params.id_user:req.apiAuthUserId
        if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
            const deleteUser = await User.deleteUser(req.apiAuthUserId)
            return res.status(200).json({result: `Successful deletion: ${req.apiAuthUserId}`});     
        }else {
            const err = new Error(`The user does not have privileges for this action`);
            err.status = 403
            throw err
        }
        
    } catch (error) {
        next(error);
    }
});

/**
 * TODO delete all dependencies (Events)
 */

//Update user
/**
 * Updating user with validation included and image upload
 * Required Token
 */

 router.put('/:id_user?', jwtAuth, upload,
 [
     body('username').optional().isLength({ min: 6 }).escape().withMessage('The username min 6 characters'),
     body('email').optional().isEmail().escape().withMessage('Email, incorrect format'),
     body('role').optional().isNumeric().withMessage('The role must be numeric'),
     body('nickname').optional().not().isEmpty().trim().escape().withMessage('The nickname is required'),
     body('latitude').optional().isNumeric().withMessage('The latitude must be numeric'),
     body('longitude').optional().isNumeric().withMessage('The longitude must be numeric'),
     body('password').optional().custom(password => {   
/**
* Validate password, minimum requirements.
* Validate email, username, nickname no accept duplicates  
*/                     
         if ((typeof password != 'undefined') && !passwordSchema.validate(password)){
             return false
         }else{
             return true
         }
     }),
     body('email').optional().custom(async email=>{
         const resultE = await User.existsEmail(email);
         if (resultE >0){
             throw new Error(`Email already exists: ${email}`);
         } else {
             return true
         }
     }).escape().withMessage('E-mail already exists'),
     
     body('username').optional().custom(async username=>{
         const resultU = await User.existsUserName(username);
         if (resultU >0){
             throw new Error(`Username already exists: ${username}`);
         } else {
             return true
         }
     }).escape().withMessage('Username, already exists'),
     
     body('nickname').optional().custom(async nickname=>{
         const resultN = await User.existsNickName(nickname);
         if (resultN >0){
             throw new Error(`Nickname already exists: ${nickname}`);
         } else {
             return true
         }
     }).escape().withMessage('Nickname, already exists'),

     
 ], 
async (req, res, next) =>{
 try {
    const idUser = req.params.id_user ? req.params.id_user:req.apiAuthUserId
    
    if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        const namePhoto = req.file ? req.file.filename :''
        const latitude = req.body.latitude ? req.body.latitude : 0
        const longitude = req.body.longitude ? req.body.longitude : 0
        const coordinates = (longitude>180.0 ||  longitude<-180.0)  && (latitude>90.0 || latitude<-90.0) ? [longitude,latitude] :[]
        const newUser = await User.updateUser(idUser,req.body,namePhoto,coordinates);
        
        const {_id,username,nickname} = newUser
        //res.status(201).json({result:{_id,username,nickname}});
        res.status(201).json({result:newUser});
    }else{
        const err = new Error(`The user does not have privileges for this action`);
        err.status = 403
        throw err
    }
 
 } catch (error) {
     next(error)      
     }
});




module.exports = router;