'use strict'

var express = require('express');
var router = express.Router();
const jwtAuth = require('../../../lib/jwtAuth');
const {body, validationResult} = require('express-validator');
const path = require('path');
const pv = require('password-validator'); //control password restrictions
const multer = require('multer');


const User = require('../../../models/User');

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






module.exports = router;