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
    //   req.query.datetype = 'date', 'created_date' //Optional  //Default 'date'
    
    const lat = parseFloat(req.query.lat, 10)
    const long = parseFloat(req.query.long, 10)
    const distance_m = parseInt(req.query.distance_m)
    const typeSearch = req.query.typeSearch
    let matchCriteria ={}
    let resultFinal 
    let geoPos
    let aggBis 
    const urlPathEvent = process.env.IMAGES_EVENTS_BASE_PATH;
    const urlPathUser = process.env.IMAGES_USERS_BASE_PATH
    let id = new mongoose.Types.ObjectId(req.query.apiAuthUserId);

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

    if (req.query.active==='true'){
        resultFinal = {...matchCriteria, date: { '$gte': new Date(Date.now())}}
    
    }else if (req.query.active==='false'){
        resultFinal = {...matchCriteria, date: { '$lte': new Date(Date.now())}}
    
    }else{
        resultFinal = {...matchCriteria}
    }

    let sortDate =-1
    if(req.query.sort){
        sortDate = req.query.sort==='asc' ? 1 : -1
    }
    let orderDateQ ={}
    
    const orderDate = req.query.datetype ? req.query.datetype: 'date';
    if(orderDate==='created_date'){
        orderDateQ = {created_date:sortDate}
    } else{
        orderDateQ = {date:sortDate}
    }
    

    aggBis = [   
        {
            $match: resultFinal   
        },

        {$facet:{
            "result":[   
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
                        photo: {$cond:[{$eq:[{$substr:['$photo',0,4]},'http']}, '$photo',{$cond:[{$eq: [{$type:'$photo'},"missing"]},{$concat:[urlPathEvent,'dei.png']},{$concat:[urlPathEvent,'$photo']} ]} ]},
                        indoor: 1,
                        location: 1,
                        tags: 1,
                        created_date:1,
                        address:1,
                        city:1,
                        postal_code:1,
                        country:1,
                        geoNear:1,
                        assistants_count: { $size: '$_id_assistants'},
                        favorite_events_count: { $size: '$_id_favorite'},
                        available_places: {$subtract:['$max_places',{$size: '$_id_assistants'}]},
                        dist :1,
                        isOwner: {$in: [id,'$_id_owner']},
                        isFavorite: {$in: [id,'$_id_favorite']},
                        isAssistant: {$in: [id,'$_id_assistants']},
                        detailOwn:{
                            _id:1,
                            username:1,
                            nickname:1,
                            email:1,
                            image:{$cond:[ {$eq:[{$substr:['$detailOwn.image',0,4]},'http']}, '$detailOwn.image',{$cond:[ 
                                {$eq: [{$type:'$detailOwn.image'}, "missing"]}
                                ,{$concat:[urlPathUser,'DefaultUserImage.png']},{$concat:[urlPathUser,'$detailOwn.image']} ]} ]},   
                        }                    
                    }
                },
 
                { 
                    $sort:orderDateQ
                },
                {
                    $skip:parseInt(req.query.skip) || 0
                },
                {
                    $limit: parseInt(req.query.limit) || 1000
                },

            ],
            "total":[
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