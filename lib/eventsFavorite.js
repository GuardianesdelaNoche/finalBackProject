'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;


function eventsFavorite(req){
//   '60e779f912b1cf13935c7e77',req.id,req.limit,req.skip,req.sort,req.active
//   req.id= '60e779f912b1cf13935c7e77'
//   req.limit = 100
//   req.skip = 1
//   req.sort ='desc'
//   req.active = false

    let matchCriteria = {_id_favorite: new mongoose.Types.ObjectId(req.id)}
    let resultFinal 
    if (req.active){
        resultFinal = {...matchCriteria, date: { '$gte': new Date(Date.now())}}
    }else{
        resultFinal = {...matchCriteria}
    }

    let sortDate =-1
    if(req.sort){
        sortDate = req.sort==='asc' ? 1:-1
    }
    // console.log('Ordenacion',sortDate )
    const agg = [
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
                _id_favorite: 1,
                assistants_count: { $size: '$_id_assistants'},
                favorite_events_count: { $size: '$_id_favorite'},
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
        {
            $lookup: {
            from: "users",
            let:{
                id_favorite:'$_id_favorite'
            },
            pipeline:[
            {
                $match:{
                    $expr:{
                        $in:[
                            '$_id',
                            '$$id_favorite'
                        ]
                    },
                    
                    
                }
            },
            {$project:{
                username: 1,
                nickname:1,
                _id:0
                }
            }
            ],
            as: "userFavorite",
            },
        },
            { $unwind: "$userFavorite"}, 
        ],
        "totalResult":[
        { "$count" : "count" }
        ]
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