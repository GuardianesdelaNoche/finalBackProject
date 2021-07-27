'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Event = require('../models/Event');

function eventsByUser(req){
    //   '60e779f912b1cf13935c7e77'
    //   req.apiAuthUserId = '60e779f912b1cf13935c7e77' //Mandatory
    //   req.query.limit = 100 //Optional
    //   req.query.skip = 1 //Optional
    //   req.query.sort ='desc' //Optional
    //   req.query.active = false //Optional
    //   req.query.lat=41.545585883662035 //Optional
    //   req.query.long=2.1071972631768157 //Optional
    //   req.query.distance_m = 5000 //unidades en metros //Optional
    //   req.query.TypeEvent = 'favorite','assistant','owner' //Mandatory //Default 'ownwer'
    
    const lat = req.query.lat
    const long = req.query.long
    const distance_m = req.query.distance_m
    const typeSearch = req.query.typeSearch
    let matchCriteria ={}
    let resultFinal 
    let geoPos
    let aggBis 

    let id = new mongoose.Types.ObjectId(req.apiAuthUserId);

    if (typeSearch === 'favorite'){
        matchCriteria = {_id_favorite: id}
    }else if(typeSearch === 'assistant'){
        matchCriteria = {_id_assistants: id}
    }else{
        matchCriteria = {_id_owner: id}
    };
    
   
    if(lat && long && distance_m){
        geoPos = [{ $geoNear:{
            near: { type: "Point", 
            coordinates: [ long, lat ] },
            distanceField: "dist.calculated",
            maxDistance: distance_m,
            spherical: true }}]
    };

    if (req.query.active){
        resultFinal = {...matchCriteria, date: { '$gte': new Date(Date.now())}
    }
    }else{
        resultFinal = {...matchCriteria}
    }

    let sortDate =-1
    if(req.query.sort){
        sortDate = req.query.sort==='asc' ? 1 : -1
    }

    aggBis = [   
        {
            $match: resultFinal   
        },

        {$facet:{
            "paginateResult":[   
                {$lookup:{from: "users", localField:"_id_owner", foreignField:"_id", as : "detailOwn"}},
                {$unwind: "$detailOwn"},
                {
                    $project: {
                        title: 1,
                        description: 1,
                        price: 1,
                        max_places: 1,
                        date: 1,
                        duration: 1,
                        photo: 1,
                        indoor: 1,
                        location: 1,
                        tags: 1,
                        geoNear:1,
                        assistants_count: { $size: '$_id_assistants'},
                        favorite_events_count: { $size: '$_id_favorite'},
                        dist :1,
                        isOwner: {$in: [id,'$_id_owner']},
                        isFavorite: {$in: [id,'$_id_favorite']},
                        isAssistant: {$in: [id,'$_id_assistants']},
                        detailOwn:{
                            _id:1,
                            username:1,
                            nickname:1,
                            email:1,
                            image:1
                        }                    
                    }
                },
 
                { 
                    $sort:{date:sortDate}
                },
                {
                    $skip:req.skip || 0
                },
                {
                    $limit: req.limit || 1000
                },

            ],
            "totalResult":[
                { "$count" : "count" }
            ],

        }
    }, 
    ]

    let aggReturn= []
    if (geoPos){
        aggReturn = geoPos.concat(aggBis); 
    }else{
        aggReturn = aggBis
    }

    return aggReturn;
}



module.exports = eventsByUser;