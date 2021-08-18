'use strict'
const i18n = require('../../../lib/i18nConfigure')
var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');
const sendingMail = require('../../../lib/nodeMail');
const recoverPassController = require('../../../controllers/recoverPassController');
const expresValidateEmail = require('../../../lib/expressValidateEmail')
const expressValidateUsername = require('../../../lib/expressValidateUsername')
const expressValidateNickname = require('../../../lib/expressValidateNickname')
//const fs = require('fs');

const User = require('../../../models/User');
const Event = require('../../../models/Event')
const { route } = require('./event');
const { response } = require('express');
const { language } = require('googleapis/build/src/apis/language');

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
            return cb(new Error(i18n.__('Only images are allowed: .png|.jpg|.gif|.jpeg')))
        }
        cb(null, true)
    },
}).single('image')


//recover Password
router.post('/recoverpass', 
        [body('email').isEmail().escape().withMessage(
            (value, { req, location, path }) => {
                return req.__('Data, incorrect format', { value, location, path });
              }
        )
        ] 
        ,async(req,res,next) => {
            i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // return res.status(422).json({ errors: errors.array()});
                return res.status(422).json({ error: errors.array()[0].msg});
            }

            try {
                //Validate id e-mail exixsts
                    const userEx = await User.getUserEmail(req.body.email)
                if (!userEx){
                    throw new Error(i18n.__("User not exists"))
                } 
                const recoverToken = await recoverPassController(req.body.email);
                if (recoverToken){
                    //Send  email
                    const respuesta =  await sendingMail(req.body.email,recoverToken,'Recover password 4events. Prueba e-mail multi destinatario',
                            `<p>Recover the password by link</p> <br><br> <p>El link es: <a href="${process.env.LINK_RECOVER_EMAIL}${recoverToken}"</p> <br><p>SOLO ES UNA PRUEBA</p>`)
                            
                    if (respuesta.accepted.length>0){
                        res.status(201).json({result:'OK'});
                    } else {
                        res.status(422).json({result:'KO'});
                    }
                    //res.status(201).json({result:respuesta});
                }

            } catch (error) {
                next(error);
            }

});


//Get any user by super administrator or own 
router.get('/:id_user?', jwtAuth, async function(req,res,next){
    try {
        const idUser = req.params.id_user ? req.params.id_user:req.apiAuthUserId
        i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')

        if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
            const resultUserId = await User.getUser(idUser)
            const {_id,username,email,address,city,postal_code,country,role,phone,nickname,image,location} = resultUserId;
            return res.status(200).json({result: {_id,username,email,address,city,postal_code,country,role,phone,nickname,image,location}});
        }  else{
            
            const err = new Error(
                i18n.__('The user does not have privileges for this action')
            );
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
        i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')

        if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
            const delFavoriteEvents = await Event.del_id_favorites(idUser);
            const delAssistants = await Event.del_id_assistants(idUser);
            const delOwners = await Event.del_id_owner(idUser);
            // //Delete avatar
            // const {image} = await User.getUser(idUser);
            // if (image && image!=='DefaultUserImage.png'){
            //     const dirName = path.join(__dirname, 'public/images/photoUser', image)
            //     console.log(dirName)
            //    // fs.unlinkSync(dirName);
            // }
            
            const deleteUser = await User.deleteUser(idUser);

            // return res.status(200).json({result: `${i18n.__('Successful deletion: ')} ${idUser}`});
            //return res.status(200).json({result: deleteUser});

            const {_id,username,nickname} = deleteUser
            res.status(201).json({result:{_id,username,nickname}});
            
        }else{
            const err = new Error(i18n.__('The user does not have privileges for this action'));
            err.status = 403
            throw err
        }
        
    } catch (error) {
        next(error);
    }
});


//Update user
/**
 * Updating user with validation included and image upload
 * Required Token
 */

 router.put('/:id_user?', jwtAuth, upload,
 [
     body('username').optional().isLength({ min: 6 }).escape().withMessage(
        (value, { req, location, path }) => {
            return req.__('The username min 6 characters', { value, location, path });
          }
         ),
     body('email').optional().isEmail().escape().withMessage(
        (value, { req, location, path }) => {
            return req.__('Email, incorrect format', { value, location, path });
          }
         ),
     body('role').optional().isNumeric().withMessage(
        (value, { req, location, path }) => {
            return req.__('The role must be numeric', { value, location, path });
          }
          ),
     body('nickname').optional().not().isEmpty().trim().escape().withMessage(
        (value, { req, location, path }) => {
            return req.__('The nickname is required', { value, location, path });
          }
          ),
     body('latitude').optional().isNumeric().withMessage(
        (value, { req, location, path }) => {
            return req.__('The latitude must be numeric', { value, location, path });
          }
          ),
     body('longitude').optional().isNumeric().withMessage(
        (value, { req, location, path }) => {
            return req.__('The longitude must be numeric', { value, location, path });
          }
          ),
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
     body('email').optional().custom(async(email,{req})=>{
        const resultEI = await expresValidateEmail(req);
        
         if (resultEI.resultE>0 && resultEI.resultE_Id===0){
             throw new Error(i18n.__('E-mail already exists'));
         } else {
             return true
         }
     }).escape().withMessage(
        (value, { req, location, path }) => {
            return req.__('E-mail already exists', { value, location, path });
          }
        ),
     
     body('username').optional().custom(async (username,{req})=>{
        const resultUI = await expressValidateUsername(req)

         if (resultUI.resultU >0 && resultUI.resultU_Id===0){
             throw new Error(i18n.__('Username, already exists'));
         } else {
             return true
         }
     }).escape().withMessage(
        (value, { req, location, path }) => {
            return req.__('Username, already exists', { value, location, path });
          }
        ),
     
     body('nickname').optional().custom(async (nickname, {req})=>{
         const resultNI = await expressValidateNickname(req)

         if (resultNI.resultN >0 && resultNI.resultN_Id===0){
             throw new Error(i18n.__('Nickname, already exists'));
         } else {
             return true
         }
     }).escape().withMessage(
        (value, { req, location, path }) => {
            return req.__('Nickname, already exists', { value, location, path });
          }
        ),    
 ], 
async (req, res, next) =>{
 try {
    const idUser = req.params.id_user ? req.params.id_user:req.apiAuthUserId
    i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
    if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
        req.body.idActiveUser = idUser;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //return res.status(422).json({ errors: errors.array()});
            return res.status(422).json({ error: errors.array()[0].msg});
        }
        const namePhoto = req.file ? req.file.filename :''
        const latitude = req.body.latitude ? req.body.latitude :200
        const longitude = req.body.longitude ? req.body.longitude : 200
        const coordinates = (longitude>180.0 ||  longitude<-180.0)  && (latitude>90.0 || latitude<-90.0) ? []:[longitude,latitude]
        const updateUser = await User.updateUser(idUser,req.body,namePhoto,coordinates);
        
        const {_id,username,nickname,email} = updateUser
        res.status(201).json({result:{_id,username,nickname}});
        
    }else{
        const err = new Error(i18n.__('The user does not have privileges for this action'));
        err.status = 403
        throw err
    }
 
 } catch (error) {
     next(error)      
    }
});




module.exports = router;