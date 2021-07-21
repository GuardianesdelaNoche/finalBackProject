
'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');


const User = require('../../../models/User');




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

router.get('/count', async function(req,res,next){

    try {
        const resultado = await User.findOwnEvents('60e779f912b1cf13935c7e77')
        
        res.status(201).json({result: resultado})
    } catch (error) {
        next(error)
    }
});

module.exports = router;