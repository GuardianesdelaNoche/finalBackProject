'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Event = require('../models/Event');

function eventsFavorite(req){
//   '60e779f912b1cf13935c7e77',req.id,req.limit,req.skip,req.sort,req.active
//   req.id= '60e779f912b1cf13935c7e77'
//   req.limit = 100
//   req.skip = 1
//   req.sort ='desc'
//   req.active = false


const lat=41.545585883662035
const long=2.1071972631768157
const distance_m=50*1000
    let matchCriteria = {_id_favorite: new mongoose.Types.ObjectId(req.id)}
    let resultFinal 
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
    // console.log('Ordenacion',sortDate )
    const agg = [
        { $geoNear: {
            near: { type: "Point", 
            coordinates: [ long, lat ] },
            distanceField: "dist.calculated",
            maxDistance: distance_m,
            //includeLocs: "dist.location",
            spherical: true }
        },
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
                //_id_favorite: 1,
                _id_owner: 1,
                assistants_count: { $size: '$_id_assistants'},
                favorite_events_count: { $size: '$_id_favorite'},
                idUserSearch: new mongoose.Types.ObjectId(req.id),
                dist :1
            
        }},
        
        { 
            $sort:{date:sortDate}
        },
        {
            $skip:req.skip || 0
        },
        {
            $limit: req.limit || 100
        },
        // {
        //     $lookup: {
        //     from: "users",
        //     let:{
        //         id_favorite:'$user'
        //     },
        //     pipeline:[
        //     {
        //         $match:{
        //             $expr:{
        //                 $eq:[
        //                     '$_id','$$id_favorite'
        //                 ]
        //             },
        //             //_id_favorite: req.id,
                    
        //         },
        //     },
        //     //{$match:{'id_favorite':{$eq:req.id}}},
            
        //     {$project:{
        //         username: 1,
        //         nickname:1,
        //         _id:1
        //         }
        //     }
        //     ],
        //     as: "userFavorite",
        //     },
        // },
        //     { $unwind: "$userFavorite"}, 
        ],
        "totalResult":[
        { "$count" : "count" }
        ],
        "userSearch":[
            {
                $project: {
                    //_id_favorite: 1,
                    //assistants_count: { $size: '$_id_assistants'},
                    //favorite_events_count: { $size: '$_id_favorite'},
                    idUserSearch: new mongoose.Types.ObjectId(req.id),
            }},
            {$group : {_id : "$idUserSearch"}},
            {$lookup:{from: "users", localField:"_id", foreignField:"_id", as : "detailSearch"}},
            {$project:{
                //user: new mongoose.Types.ObjectId(req.id),
                detailSearch:{
                    username:1,
                    nickname:1,
                    email:1,
                    image: 1,
                }
            }},
            {$unwind: "$detailSearch"}
        ],
        "userOwner":[
            {
                $project: {
                    //_id_favorite: 1,
                    //assistants_count: { $size: '$_id_assistants'},
                    //favorite_events_count: { $size: '$_id_favorite'},
                    _id_owner:1,
            }},
            {$group : {_id : "$_id_owner"}},
            {$lookup:{from: "users", localField:"_id", foreignField:"_id", as : "detailOwn"}},
            {$project:{
                //user: new mongoose.Types.ObjectId(req.id),
                detailOwn:{
                    username:1,
                    nickname:1,
                    email:1,
                    image:1,
                }
            }},
            {$unwind: "$detailOwn"}
            
        ],
        }}, 
        // { "$project": {
        //       "data": { "$concatArrays": ["$paginateResult", "$totalResult"] }
        //     }},
        //     { "$unwind": "$data" },
        //     { "$replaceRoot": { "newRoot": "$data" } }
    ]
    
    return agg;

}



module.exports = eventsFavorite;