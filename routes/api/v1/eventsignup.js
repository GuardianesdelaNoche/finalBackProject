'use strict'

var express = require('express');
var router = express.Router();
const Event = require('../../../models/Event');
const User = require ('../../../models/User');
const jwtAuth = require('../../../lib/jwtAuth');
const mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const i18n = require('../../../lib/i18nConfigure')
const expressValidateFavorite = require('../../../lib/expressValidateFavorite')



router.put('/:id_user?', jwtAuth,
 [
     body('_id_favorite').custom(_id_favorite => {   
                    
         if (mongoose.isValidObjectId(_id_favorite)){
             return true
         }else{
             return false
         }
     }).escape().withMessage('_id_favorite, not valid'),

     body('_id_favorite').custom(async(_id_favorite)=>{
        const resultFav = await Event.existsOne(_id_favorite);
        
         if (resultFav){
             return true
         } else {
            throw new Error(`Event no exists`);
         }
     }).escape().withMessage(`Event no exists`),
     
     //Verify the user is not in favorites
     body('_id_favorite').custom(async (_id_favorite,{req})=>{
        
        const resultUF = await expressValidateFavorite(req)
        
         if (resultUF>0){
             throw new Error(`Favorite already exists in this event ${resultUF} despues`);
         } else {
             return true
         }
     })
     .escape().withMessage('Favorite, already exists'),    
 ], 
async (req, res, next) =>{
 try {
    const idUser = req.params.id_user ? req.params.id_user:req.apiAuthUserId
    i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
    if ((req.apiAuthUserRole===9 && req.params.id_user) || !req.params.id_user){
        req.body.idActiveUser = idUser;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array()});
        }

        //Insert a new id_user in favorite event
        const insertFavorite = await Event.add_id_favorite(idUser,req.body._id_favorite)

        res.status(201).json({result:insertFavorite});
        
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