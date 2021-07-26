'use strict';
require('dotenv').config();
const faker = require('faker');
const Event = require('../models/Event');

 module.exports = async function toMockData(){
    try {
        const tags = ['yoga', 'baile', 'futbol', 'paintball', 'concierto'];
        for (let index = 0; index <= 100; index++) {
            const newEvent = new Event({
                 title: faker.name.title(),
                 description: faker.lorem.paragraph() ,
                 price: faker.commerce.price(),
                 max_places: faker.datatype.number(100),
                 date: faker.date.between("2021-01-01", "2021-12-31"),
                 duration: faker.datatype.number(60),
                 photo: faker.image.image(),
                 indoor: faker.datatype.boolean(),
                 location: {
                    type: 'Point',
                    coordinates: [ faker.address.longitude(), faker.address.latitude() ]
                  },
                 address: faker.address.direction(),
                 city: faker.address.cityName(),
                 postal_code: faker.address.zipCode(),
                 country: faker.address.country(),
                 tags: tags[Math.floor(Math.random() * tags.length)],
                 _id_assistants: [],
                 _id_owner: [],
                 _id_favorite: []
            });
        
            await newEvent.save();
        }    
            console.log('done mock')
    } catch (error) {
        console.log(error);
    }

};