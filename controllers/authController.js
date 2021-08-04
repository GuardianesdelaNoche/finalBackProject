'use strict'
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
    async postJWT(req,res,next){
    try{
            const{email,password} = req.body;

            //Search the User in BBDD
            const user = await User.findOne({email})

            //if it doesn't exist, error
        
            if (!user || !(await user.comparePassword(password)) ){
                const error = new Error('Invalid credentials');
                error.status = 401;
                next(error);
                return;
            }
           
            //if user and password exists
            //Create a signed token
            jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN }, (err, jwtToken) => {
                if (err) {
                  next(err);
                  return;
                }
                // return to client
                res.json({ token: jwtToken});
              });
            
        } catch(err){
            next(err);
        }
    }

}

module.exports = new AuthController();