'use strict';

const cote = require('cote');
const distCalc = require('pepe-distcalc')
const User = require('../models/User');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
require('dotenv').config();
require('../lib/connectMongoose');

//Postal code to coordinates conversion service

// Declare microservice

const responder = new cote.Responder({name: 'Transform zipCode'})

const coord = async (country,zipCode) =>{
    try {
        const zipPos = await distCalc.codPostToLocation(country,zipCode);
        return zipPos
    } catch (error) {
        console.error(error);
    }    
};

//Example country and zip code
//test4('Spain','08210');


//Microservice
responder.on('Transform zipCode', async (req, done) => {

    const zipCode = req.zipCode
    const country = req.country
    const idUser = req.idUser
    try {
        const resultCoor =  await coord(country,zipCode)
         if (resultCoor.coord){
            const coordinates = resultCoor.coord.lat? [resultCoor.coord.lon,resultCoor.coord.lat]:[]
            const valObject= {}
            coordinates.length ? valObject.location = {'coordinates': coordinates, 'type':'Point'}:{};
            const updateUser = await User.findByIdAndUpdate(
                {_id: idUser },
                {$set: valObject},
                {new: true}
            )
         }
        done({city:resultCoor.city}); 
    } catch (error) {
        console.error(error)
    }
    
});
