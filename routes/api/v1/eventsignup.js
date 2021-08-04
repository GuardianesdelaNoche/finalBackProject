'use strict'

var express = require('express');
var router = express.Router();
const Event = require('../../../models/Event');
const User = require ('../../../models/User');
const jwtAuth = require('../../../lib/jwtAuth');
const mongoose = require('mongoose');
const {body, validationResult} = require('express-validator');
const i18n = require('../../../lib/i18nConfigure')
const expressValidateFavorite = require('../../../lib/expressValidateFavorite');
const expressValidateAssistant = require('../../../lib/expressValidateAssistant');
const sendingMail = require('../../../lib/nodeMail');
const { response } = require('express');
const { language } = require('googleapis/build/src/apis/language');

//Add user in favorite event
router.put('/favsignup', jwtAuth,
 [
    body('eventfavorite').custom(eventfavorite => {   
                
        if (mongoose.isValidObjectId(eventfavorite)){
            return true
        }else{
            return false
        }
    }).escape().withMessage('eventfavorite, format not valid'),

    body('eventfavorite').custom(async(eventfavorite)=>{
    const resultFav = await Event.existsOne(eventfavorite);
    
        if (resultFav){
            return true
        } else {
        throw new Error(`Event no exists`);
        }
    }).escape().withMessage(`Event no exists`),
    
    //Verify the user is not in favorites
    body('eventfavorite').custom(async (eventfavorite,{req})=>{
    
    const resultUF = await expressValidateFavorite(req)
    
        if (resultUF>0){
            throw new Error(`Favorite already exists in this event ${resultUF} despues`);
        } else {
            return true
        }
    })
    .escape().withMessage('Favorite, already exists in this event'),    
 ], 
async (req, res, next) =>{
    try {
        const idUser = req.apiAuthUserId
        i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
            //req.body.idActiveUser = idUser;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array()});
            }

            //Insert a new id_user in favorite event
            const insertFavorite = await Event.add_id_favorite(idUser,req.body.eventfavorite)

            const {_id} = insertFavorite
            res.status(201).json({result:_id});
    
    } catch (error) {
     next(error)      
    }
});

//Delete user in favorite event
router.delete('/favsignup', jwtAuth,
 [
    body('eventfavorite').custom(eventfavorite => {   
                
        if (mongoose.isValidObjectId(eventfavorite)){
            return true
        }else{
            return false
        }
    }).escape().withMessage('eventfavorite, format not valid'),

    body('eventfavorite').custom(async(eventfavorite)=>{
    const resultFav = await Event.existsOne(eventfavorite);
    
        if (resultFav){
            return true
        } else {
            throw new Error(`Event no exists`);
        }
    }).escape().withMessage(`Event no exists`),
    
    //Verify the user is in favorites
    body('eventfavorite').custom(async (eventfavorite,{req})=>{
    
    const resultUF = await expressValidateFavorite(req)
    
        if (resultUF>0){
            return true
        } else {
            throw new Error(`Favorite already exists in this event ${resultUF} `);      
        }
    })
    .escape().withMessage('Favorite, No exists in this event'),    
 ], 
async (req, res, next) =>{
    try {
        const idUser = req.apiAuthUserId
        i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
            //req.body.idActiveUser = idUser;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array()});
            }

            //Insert a new id_user in favorite event
            const insertFavorite = await Event.del_id_favorite(idUser,req.body.eventfavorite)
            const {_id} = insertFavorite
            res.status(201).json({result:_id});
    
    } catch (error) {
     next(error)      
    }
});

//Add user in assistant event
router.put('/assistsignup', jwtAuth,
 [
    body('eventassistants').custom(eventassistants => {   
                
        if (mongoose.isValidObjectId(eventassistants)){
            return true
        }else{
            return false
        }
    }).escape().withMessage('eventassistants, format not valid'),

    body('eventassistants').custom(async(eventassistants)=>{
    const resultAss = await Event.existsOne(eventassistants);
    
        if (resultAss){
            return true
        } else {
            throw new Error(`Event no exists`);
        }
    }).escape().withMessage(`Event no exists`),
    
    //Verify the user is not in favorites
    body('eventassistants').custom(async (eventassistants,{req})=>{
    
    const resultUA = await expressValidateAssistant(req)
    
        if (resultUA>0){
            throw new Error(`Assistant already exists in this event ${resultUA} `);
        } else {
            return true
        }
    })
    .escape().withMessage('Assistant, already exists in this event'),  
    
    //Verify the available places
    body('eventassistants').custom(async (eventassistants)=>{
    
        const resultAvailable = await Event.availablePlaces(eventassistants); 
            if (resultAvailable>0){
                return true
            } else {
                throw new Error(`NOT available places in this event ${resultUA} `);
            }
        })
        .escape().withMessage('NOT available places in this event'),   
 ], 
async (req, res, next) =>{
    try {
        const idUser = req.apiAuthUserId
        i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
            //req.body.idActiveUser = idUser;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array()});
            }

            //Insert a new id_user in assistants event
            const insertassistant = await Event.add_id_assistant(idUser,req.body.eventassistants)
            //TODO send an email to assistant and owner
            const {_id, _id_owner,title,date,city} = insertassistant
            const owner = _id_owner[0]
            const {email:emailOwn} = await User.getUser(owner);
            const {email:emailUser} = await User.getUser(req.apiAuthUserId);
            const recoverEvent = _id
            let respuesta ={accepted:[]}
            //Send an email confirm to ADD a assistant in event
            //respuesta =  await sendingMail(emailUser,recoverEvent,'Add user in event . Prueba e-mail multi destinatario',
            //    `<p>Add user in Event</p> <br><br> <p>El link es: <a href="${LINK_EMAIL_EVENTS_ADD_DEL_FAV_ASSIT}"</p> <br><p>SOLO ES UNA PRUEBA</p>`,emailOwn)
            const respuestaOK = respuesta.accepted.length >0 ? 'OK':'Error email' ; 

            res.status(201).json({result:{_id,_id_user:req.apiAuthUserId,title,date,city,sendEmail:respuestaOK,action:'Add assistant'}});
    
    } catch (error) {
     next(error)      
    }
});


//Delete user in assistant event
router.delete('/assistsignup', jwtAuth,
 [
    body('eventassistants').custom(eventassistants => {   
                
        if (mongoose.isValidObjectId(eventassistants)){
            return true
        }else{
            return false
        }
    }).escape().withMessage('eventassistants, format not valid'),

    body('eventassistants').custom(async(eventassistants)=>{
    const resultAss = await Event.existsOne(eventassistants);
    
        if (resultAss){
            return true
        } else {
            throw new Error(`Event no exists`);
        }
    }).escape().withMessage(`Event no exists`),
    
    //Verify the user is not in favorites
    body('eventassistants').custom(async (eventassistants,{req})=>{
    
    const resultUA = await expressValidateAssistant(req)
    
        if (resultUA>0){
            return true
        } else {
            throw new Error(`Assistant NO exists in this event ${resultUA} `);       
        }
    })
    .escape().withMessage('Assistant, NO exists in this event'),    
 ], 
async (req, res, next) =>{
    try {
        const idUser = req.apiAuthUserId
        i18n.setLocale(req.headers['accept-language']||req.headers['Accept-Language']|| req.query.lang || 'en')
            //req.body.idActiveUser = idUser;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array()});
            }

            //Delete id_user in assistants event
            const deleteassistant = await Event.del_id_assistant(idUser,req.body.eventassistants)
            // Send an email to assistant and owner
            //Search email user athenticate
            //Search email user event owner
            //Send an email 
            const {_id, _id_owner,title,date,city} = deleteassistant
            const owner = _id_owner[0]
            const {email:emailOwn} = await User.getUser(owner);
            const {email:emailUser} = await User.getUser(req.apiAuthUserId);
            const recoverEvent = _id
            let respuesta ={accepted:[]}
            //Send an email confirm to DELETE a assistant in event
            //respuesta =  await sendingMail(emailUser,recoverEvent,'Delete user in event . Prueba e-mail multi destinatario',
               // `<p>Delete user in Event</p> <br><br> <p>El link es: <a href="${LINK_EMAIL_EVENTS_ADD_DEL_FAV_ASSIT}${recoverEvent}"</p> <br><p>SOLO ES UNA PRUEBA</p>`,emailOwn)
            const respuestaOK = respuesta.accepted.length >0 ? 'OK':'Error email' ; 

            res.status(201).json({result:{_id,_id_user:req.apiAuthUserId,title,date,city,sendEmail:respuestaOK,action:'Delete assistant'}});
    
    } catch (error) {
     next(error)      
    }
});


module.exports = router;