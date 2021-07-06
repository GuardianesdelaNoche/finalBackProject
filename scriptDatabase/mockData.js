'use strict';
require('dotenv').config();
const faker = require('faker');
const Event = require('../models/Event');

 module.exports = async function toMockData(){
    try {
        const tags = ['yoga', 'baile', 'futbol', 'paintball', 'concierto'];
        for (let index = 0; index <= 10; index++) {
            const newEvent = new Event({
                 title: faker.name.title(),
                 description: faker.lorem.paragraph() ,
                 price: faker.commerce.price(),
                 max_places: faker.datatype.number(1,25),
                 date: faker.date.between("2020", "2021"),
                 duration: faker.datatype.number(1,25),
                 photo: faker.image.image(),
                 indoor: faker.datatype.boolean(),
                 tags: tags[Math.floor(Math.random() * tags.length)],
                 _id_assistants: []
            });
        
            await newEvent.save();
        }    
            console.log('done mock')
    } catch (error) {
        console.log(error);
    }

};