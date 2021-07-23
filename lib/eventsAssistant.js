'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Event = require('../models/Event');

function eventsAssistant(req){
    //   '60e779f912b1cf13935c7e77',req.id,req.limit,req.skip,req.sort,req.active
    //   req.id= '60e779f912b1cf13935c7e77'
    //   req.limit = 100
    //   req.skip = 1
    //   req.sort ='desc'
    //   req.active = false
    //   req.lat=41.545585883662035
    //   req.long=2.1071972631768157
    //   req.distance_m = 5000 unidades en metros
   
    const lat = req.lat
    const long = req.long
    const distance_m = req.distance_m
    const typeSearch = req.typeSearch
    let matchCriteria ={}
    let resultFinal 
    let geoPos
    let aggBis 

    matchCriteria = {_id_assistants: new mongoose.Types.ObjectId(req.id)}
   
    if(lat && long && distance_m){
        geoPos = [{ $geoNear:{
            near: { type: "Point", 
            coordinates: [ long, lat ] },
            distanceField: "dist.calculated",
            maxDistance: distance_m,
            spherical: true }}]
    };

    if (req.active){
        resultFinal = {...matchCriteria, date: { '$gte': new Date(Date.now())}
    }
    }else{
        resultFinal = {...matchCriteria}
    }

    let sortDate =-1
    if(req.sort){
        sortDate = req.sort==='asc' ? 1:-1
    }

    aggBis = [   
        {
            $match: resultFinal   
        },

        {$facet:{
            "paginateResult":[   
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
                        _id_owner: 1,
                        assistants_count: { $size: '$_id_assistants'},
                        favorite_events_count: { $size: '$_id_favorite'},
                        idUserAssistants: new mongoose.Types.ObjectId(req.id),
                        dist :1                   
                    }
                },
                
                { 
                    $sort:{date:sortDate}
                },
                {
                    $skip:req.skip || 0
                },
                {
                    $limit: req.limit || 100
                },

            ],
            "totalResult":[
                { "$count" : "count" }
            ],
            "userAssistants":[
                {
                    $project: {
                        idUserSearch: new mongoose.Types.ObjectId(req.id),
                }},
                {$group : {_id : "$idUserAssistants"}},
                {$lookup:{from: "users", localField:"_id", foreignField:"_id", as : "detailAssistants"}},
                {$project:{
                    detailAssistants:{
                        username:1,
                        nickname:1,
                        email:1,
                        image: 1,
                    }
                }},
                {$unwind: "$detailAssistants"}
            ],
            "userOwner":[
                {
                    $project: {
                        _id_owner:1,
                    }
                },
                {$group : {_id : "$_id_owner"}},
                {$lookup:{from: "users", localField:"_id", foreignField:"_id", as : "detailOwn"}},
                {$project:{
                    detailOwn:{
                        username:1,
                        nickname:1,
                        email:1,
                        image:1,
                    }
                }},
                {$unwind: "$detailOwn"}
                
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



module.exports = eventsAssistant;