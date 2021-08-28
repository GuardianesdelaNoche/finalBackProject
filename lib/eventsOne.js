/* eslint-disable no-unused-vars */
'use strict';

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Event = require('../models/Event');

function eventsOne(authenticate,eventId,latitude,longitude){
    
    const id = authenticate ? new mongoose.Types.ObjectId(authenticate):'';
    const lat = latitude;
    const long = longitude;
    const distance_m = 99999999999;
    const urlPathEvent = process.env.IMAGES_EVENTS_BASE_PATH;
    const urlPathUser = process.env.IMAGES_USERS_BASE_PATH;
    let geoPos;
    //const distance_m = distance
    if(lat && long && distance_m){
        geoPos = [{ $geoNear:{
            near: { type: "Point", 
            coordinates: [ long, lat ] },
            distanceField: "dist.calculated",
            maxDistance: distance_m,
            spherical: true }}];
    };

    let detailOneVal ={};
     
    if (id){
        detailOneVal= {
            _id:1,
            username:1,
            nickname:1,
            email:1,
            image:{$cond:[ {$eq:[{$substr:['$detailOwn.image',0,4]},'http']}, '$detailOwn.image',{$cond:[ 
                {$eq: [{$type:'$detailOwn.image'}, "missing"]}
                ,{$concat:[urlPathUser,'DefaultUserImage.png']},{$concat:[urlPathUser,'$detailOwn.image']} ]} ]},                  
        };     
    }else{
        detailOneVal = {
            _id:1,
            nickname:1,
            image:{$cond:[ {$eq:[{$substr:['$detailOwn.image',0,4]},'http']}, '$detailOwn.image',{$cond:[ 
            {$eq: [{$type:'$detailOwn.image'}, "missing"]}
            ,{$concat:[urlPathUser,'DefaultUserImage.png']},{$concat:[urlPathUser,'$detailOwn.image']} ]} ]},        
        };              
    }

    const resultOne = [
        {
            $match: {_id: mongoose.Types.ObjectId(eventId) }
        },
        {
            $facet:{
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
                            //dist :1,
                            event_distance: { 
                                $cond: [
                                    {$ifNull: ['$dist', false]}, 
                                    '$dist.calculated',
                                    -1
                                ]
                            },
                            isOwner: {$in: [id,'$_id_owner']},
                            isFavorite: {$in: [id,'$_id_favorite']},
                            isAssistant: {$in: [id,'$_id_assistants']},
                            detailOwn: detailOneVal            
                        }
                    },
                        
                ],
            }
        },
    ];
 
return resultOne;

};

module.exports = eventsOne;