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

/**
 * Recording of new events with validation included and image upload
 * Not required Token
 */

router.post('/', upload,
    [
        body('username').isLength({ min: 6 }).escape().withMessage('The username is required and min 6 characters'),
        body('email').isEmail().escape().withMessage('Email, incorrect format'),
        body('role').isNumeric().withMessage('The role must be numeric'),
        body('nickname').not().isEmpty().trim().escape().withMessage('The nickname is required'),
        body('password').custom(password => {   
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
        body('email').custom(async email=>{
            const resultE = await User.existsEmail(email);
            if (resultE >0){
                throw new Error(`Email already exists: ${email}`);
            } else {
                return true
            }
        }).escape().withMessage('E-mail already exists'),
        
        body('username').custom(async username=>{
            const resultU = await User.existsUserName(username);
            if (resultU >0){
                throw new Error(`Username already exists: ${username}`);
            } else {
                return true
            }
        }).escape().withMessage('Username, already exists'),
        
        body('nickname').custom(async nickname=>{
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }
        const namePhoto = req.file ? req.file.filename :''
        const newUser = await User.newUser(req.body,namePhoto);
        const {_id,username,nickname} = newUser
        res.status(201).json({result:{_id,username,nickname}});
    
    } catch (error) {
        next(error)      
        }
});




module.exports = router;