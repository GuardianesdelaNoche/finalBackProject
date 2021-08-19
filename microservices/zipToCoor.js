'use strict';

const cote = require('cote');
const distCalc = require('pepe-distcalc')

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


//Lógica del microservicio
responder.on('Transform zipCode', async (req, done) => {

    const zipCode = req.zipCode
    const country = req.country
    const resultCoor =  await coord(country,zipCode)
    console.log('El resultado es:', resultCoor )
    //Devolvemos el nombre de la nueva imágen creada
    //done(resultCoor); 
    done('OK'); 
});
