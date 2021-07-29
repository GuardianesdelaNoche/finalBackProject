'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Event = require('../models/Event');

function eventsAll(filters, startRow, numRows, sortField, authenticate,latitude,longitude,distance){

    const id = authenticate ? new mongoose.Types.ObjectId(authenticate):'';
    const lat = latitude
    const long = longitude
    const distance_m = distance
    if(lat && long && distance_m){
        geoPos = [{ $geoNear:{
            near: { type: "Point", 
            coordinates: [ long, lat ] },
            distanceField: "dist.calculated",
            maxDistance: distance_m,
            spherical: true }}]
    };


    let resultQ =[]
    if (id){
        resultQ = [
            {
                $match: filters   
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
                            photo: 1,
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
                            available_places: {$subtract:['$max_places',{$size: '$_id_favorite'}]},
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

                    { $sort: { "date": sortField }},
                    {
                        $skip: startRow
                    },
                    {
                        $limit: numRows
                    },
      
                ],
                "total":[
                    { "$count" : "count" }
                ],
            }
          }, 
            
        ]

    }else{
        resultQ = [{
            $match: filters   
        },
        {$facet:{
            "result":[
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
                            created_date:1,
                            address:1,
                            city:1,
                            postal_code:1,
                            country:1,
                            assistants_count: { $size: '$_id_assistants'},
                            favorite_events_count: { $size: '$_id_favorite'},
                            available_places: {$subtract:['$max_places',{$size: '$_id_favorite'}]},
                            isOwner: {$in: [id,'$_id_owner']},
                            isFavorite: {$in: [id,'$_id_favorite']},
                            isAssistant: {$in: [id,'$_id_assistants']},          
                        }
                    },

                { $sort: { "date": sortField }},
                {
                    $skip: startRow
                },
                {
                    $limit: numRows
                },
  
            ],
            "total":[
                { "$count" : "count" }
            ],
        }
      }, ]



    }

return resultQ

};

module.exports = eventsAll;