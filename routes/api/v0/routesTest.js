
'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');
const expressValidateUsername = require('../../../lib/expressValidateUsername')


const User = require('../../../models/User');
const Event = require('../../../models/Event')




router.put('/', async function (req, res, next){

    try {
        const insertV = await User.addSuscribe_Events('60e779f912b1cf13935c7e77','60e8007cd6104c0ab7019c54')
        res.status(201).json({result: insertV})
    } catch (error) {
        next(error)
    }
});

router.delete('/', async function (req, res, next){

    try {
        const insertV = await User.delSuscribe_Events('60e779f912b1cf13935c7e77','60e8007cd6104c0ab7019c54')
        res.status(201).json({result: insertV})
    } catch (error) {
        next(error)
    }
});

router.get('/populateSearch', async function(req,res,next){

    try {
        const resultado = await User.findOwnEvents('60e779f912b1cf13935c7e77')
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

// router.get('/count', async function(req,res,next){

//     try {
//         const resultado = await User.findOwnEventsE('60e78514162e7719e5684c1d')
        
//         res.status(201).json({result: resultado})
//     } catch (error) {
//         next(error)
//     }
// });

router.get('/ownevent', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.apiAuthUserId= '60f49f376eb9eb0f543c3f94'
        req.query.limit = 100
        req.query.skip = 0
        req.query.sort ='desc'
        req.query.active = false
        
        const resultado = await Event.findFavoriteEventsPaginate(req)
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

router.get('/favoriteevent', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.query.apiAuthUserId= '60e779f912b1cf13935c7e77'
        req.query.limit = 100
        req.query.skip = 0
        req.query.sort ='desc'
        req.query.active = false
        req.query.lat=41.545585883662035
        req.query.long=2.1071972631768157
        req.query.distance_m = 70000 
        req.query.TypeEvent ='favorite'
        
        const resultado = await Event.findFavoriteEventsPaginate(req)
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

router.get('/assistant', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.apiAuthUserId= '60f1d5a450cb72aee3c52794'
        //req.id= '60f49f376eb9eb0f543c3f94'
        req.query.limit = 100
        req.query.skip = 0
        req.query.sort ='desc'
        req.query.active = false
        req.query.lat=41.545585883662035
        req.query.long=2.1071972631768157
        req.query.distance_m = 70000000
        req.query.TypeEvent ='favorite'
        
        const resultado = await Event.findAssistantsEventsPaginate(req)
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

// Delete all User events
router.delete('/delUser', async function(req,res,next){
    try {
        const idUser = '60e78514162e7719e5684c1d'
        const delOwners = await Event.del_id_owner(idUser);
        res.status(201).json({result: delOwners})
    } catch (error) {
        next(error)
    }
    
});

//Delete Users assistants in events
router.put('/delAssistance', async function(req,res,next){
    try {
        req.id= '60f1d5a450cb72aee3c52794'
        //req.id= '60f49f376eb9eb0f543c3f94'
        const delAssistants = await Event.del_id_assistants(idUser);
        res.status(201).json({result: delAssistants})
    } catch (error) {
        next(error)
    }
    
});

//Exists Email
router.get('/existEmail', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.id= '60f1d5a450cb72aee3c52794'
        //req.id= '60f49f376eb9eb0f543c3f94'
        req.email='josep.mercader@gmail.com'
        const resultado = await User.existsEmail(req.email,req.id);
        console.log('Resultado email+id: ',resultado)
        const resultado2 = await User.getUserEmail(req.email);
        console.log('Resultado email: ',resultado2)
        
        res.status(201).json({result: resultado, resultado2})
    } catch (error) {
        next(error)
    }
});

//Exists Email
router.get('/existUsername', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.id= '60f1d5a450cb72aee3c52794'
        //req.id= '60f49f376eb9eb0f543c3f94'
        req.username='Pepe pruebas'
        const resultado = await User.existsUserNameId(req.id);
        console.log('Resultado email+id: ',resultado)
        const resultado2 = await User.existsUserName(req.username);
        console.log('Resultado email: ',resultado2)
        
        res.status(201).json({result: resultado, resultado2})
    } catch (error) {
        next(error)
    }
});


module.exports = router;