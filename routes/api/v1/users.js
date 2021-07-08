'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');


const User = require('../../../models/User');

//Get any user by super administrator
router.get('/:id_user', jwtAuth, async function(req,res,next){
    try {
        if (req.apiAuthUserRole===9){
            const resultUserId = await User.getUser(req.params.id_user)
            const {_id,username} = resultUserId;
            return res.status(200).json({result: {_id,username}});
        } else {
             const err = new Error(`The user does not have privileges for this action`);
            err.status = 403
            throw err
        }    
    } catch (error) {
        next(error);
    }
})

//Get user to edit
router.get('/', jwtAuth, async function(req,res,next){
    try {
        const resultUser = await User.getUser(req.apiAuthUserId)
        const {_id,username} = resultUser;
        return res.status(200).json({result: {_id,username}});
    } catch (error) {
        next(error);
    }
});


//Delete user
router.delete('/', jwtAuth, async function(req,res,next){
    try {
        const deleteUser = await User.deleteUser(req.apiAuthUserId)
        const {_id,username} = deleteUser;
        return res.status(200).json({result: `Successful deletion: ${req.apiAuthUserId}`});
    } catch (error) {
        next(error);
    }
});




/**
 * TODO delete all dependencies (Events)
 */






module.exports = router;