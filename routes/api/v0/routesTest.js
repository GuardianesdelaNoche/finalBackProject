
'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');


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
        req.id= '60f49f376eb9eb0f543c3f94'
        req.limit = 100
        req.skip = 0
        req.sort ='desc'
        req.active = false
        
        const resultado = await Event.findFavoriteEventsPaginate(req)
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

router.get('/favoriteevent', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.id= '60e779f912b1cf13935c7e77'
        req.limit = 100
        req.skip = 0
        req.sort ='desc'
        req.active = false
        req.lat=41.545585883662035
        req.long=2.1071972631768157
        req.distance_m = 70000 
        req.TypeEvent ='favorite'
        
        const resultado = await Event.findFavoriteEventsPaginate(req)
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

router.get('/assistant', async function(req,res,next){

    try {
        //req.sort = 'asc' or 'desc'
        req.id= '60e779f912b1cf13935c7e77'
        req.limit = 100
        req.skip = 0
        req.sort ='desc'
        req.active = false
        req.lat=41.545585883662035
        req.long=2.1071972631768157
        req.distance_m = 70000000
        req.TypeEvent ='favorite'
        
        const resultado = await Event.findAssistantsEventsPaginate(req)
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});


module.exports = router;