'use strict'
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function recoverPassController(email){
    try{
            //Search the User in BBDD
            const user = await User.findOne({email})
            
            //if it doesn't exist, error
        
            if (!user ){
                const error = new Error('Invalid e-mail');
                error.status = 401;
                return error;
            }
           
            //if user exists
            //Create a signed token and send to e-mail
            return jwt.sign({ _id: user._id, role: 99 }, process.env.JWT_SECRET, { expiresIn: 240 });
        } catch(err){
            return err;
        }
    };

module.exports = recoverPassController;