'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Event = require('./Event');
const { PreconditionFailed } = require('http-errors');
var Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    username: {type: String, unique: true, index: true,required: true},
    email: {type: String, unique: true, index: true,required: true},
    address: {type: String, index: true },
    city: {type: String, index: true},
    postal_code: {type: String, index: true},
    country: { type: String, index: true },
    role: {type:Number, index: true,required: true},
    password: {type: String, required: true},
    phone: {type: String},
    nickname: {type: String, unique: true, index: true,required: true},
    image: {type: String},
    created_date: { type: Date, index: true, default: Date.now },
    my_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    suscribe_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    fav_events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    location: {
        type: {type: String},
        coordinates: [Number]
    }
});
userSchema.index({ "location": "2dsphere" });

userSchema.statics.hashPassword = function(passwordOriginal){
    return bcrypt.hash(passwordOriginal, 10);
}

userSchema.methods.comparePassword = function(passwordOriginal){
    return bcrypt.compare(passwordOriginal, this.password);
}

userSchema.statics.existsEmail = function(email){
    const isUser = User.count({email: { $regex : new RegExp(email.toLowerCase(), "i") }, deleted:null})
    return isUser.exec()
}

userSchema.statics.existsUserName = function(username){
    const isUserName = User.count({username: { $regex : new RegExp(username.toLowerCase(), "i") }, deleted:null})
    return isUserName.exec()
}

userSchema.statics.existsNickName = function(nickname){
    const isUserNickName = User.count({nickname:{ $regex : new RegExp(nickname.toLowerCase(), "i") }, deleted:null})
    return isUserNickName.exec()
}

//Create a new user
userSchema.statics.newUser = async function(userNew,namePhoto='',coordinates=[]){
    if(namePhoto){
        Object.assign(userNew,{'image': namePhoto})
    } else {
        Object.assign(userNew,{'image': 'DefaultUserImage.png'}) 
    }

    if(coordinates.length){
        Object.assign(userNew,{'location':{'coordinates': coordinates, 'type':'Point'}})
    }
    const encriptPass = await User.hashPassword(userNew.password)
    const userEncript = {...userNew,password:encriptPass}
    const user = new User(userEncript);
    const createUser = user.save();
    return createUser;
}

 //GET User
userSchema.statics.getUser = function(idUser){
    //const query = User.findById(idUser).populate('suscribe_events');
    const query = User.findById(idUser);
    return query.exec();
}

 //GET User by e-mail
 userSchema.statics.getUserEmail = function(email){
    const query = User.countDocuments({email});
    return query.exec();
}

 //Delete User
userSchema.statics.deleteUser = function(idUser){
     const query = User.findOneAndDelete({_id:idUser})
     return query.exec();
}

//Delete User image if is not a DefaultUserImage.png
/**
 * TODO
 * Delete image in public/images/photoUser
 */

/**
 * Update user 
 */
 userSchema.statics.updateUser = async function(idUser,reqValues,namePhoto='',coordinates=[]){
    const valUpdate = reqValues
    const valObject= {}
    if (valUpdate.password){
        const encriptPass = await User.hashPassword(valUpdate.password)
        valObject.password = encriptPass
    }
    

    valUpdate.username ? valObject.username = valUpdate.username:{}
    valUpdate.email ? valObject.email = valUpdate.email:{};
    valUpdate.address ? valObject.address = valUpdate.address:{};
    valUpdate.city ? valObject.city = valUpdate.city:{};
    valUpdate.postal_code ? valObject.postal_code = valUpdate.postal_code:{};
    valUpdate.country ? valObject.country = valUpdate.country:{};
    valUpdate.role ? valObject.role = valUpdate.role:{};
    valUpdate.phone ? valObject.phone = valUpdate.phone:{};
    valUpdate.nickname ? valObject.nickname = valUpdate.nickname:{};
    namePhoto ? valObject.image = namePhoto:{};
    coordinates.length ? valObject.location = {'coordinates': coordinates, 'type':'Point'}:{};

    const updateUser =  User.findByIdAndUpdate(
        {_id: idUser },
        {$set: valObject},
        {new: true}
    ).exec()
        return updateUser

 }



//Add new Event _id in suscribe_events
userSchema.statics.addSuscribe_Events = function(idUser,idEvent){
    const updateSuscribe =  User.findByIdAndUpdate(
        {_id: idUser },
        {$addToSet: {suscribe_events: idEvent } },
        {new: true}
    ).exec()
        return updateSuscribe
};
////Delete Event _id in suscribe_events
userSchema.statics.delSuscribe_Events = function(idUser,idEvent){
    const deleteSuscribe =  User.findByIdAndUpdate(
        {_id: idUser },
        {$pull: {suscribe_events: idEvent } },
        {new: true}
    ).exec()
        return deleteSuscribe
};

// Add a new Event _id in my_events
userSchema.statics.addMy_Events = function(idUser,idEvent){
    const updateMy =  User.findByIdAndUpdate(
        {_id: idUser },
        {$addToSet: {my_events: idEvent } },
        {new: true}
    ).exec()
        return updateMy
};

// Delete Event _id in my_events
userSchema.statics.delMy_Events = function(idUser,idEvent){
    const deleteMy =  User.findByIdAndUpdate(
        {_id: idUser },
        {$pull: {my_events: idEvent } },
        {new: true}
    ).exec()
        return deleteMy
};


// Add a new Event _id in fav_events 
userSchema.statics.addFavEvents = function(idUser,idEvent){
    const updateFav =  User.findByIdAndUpdate(
        {_id: idUser },
        {$addToSet: {fav_events: idEvent } },
        {new: true}
    ).exec()
        return updateFav
};

// Delete Event _id in fav_events 
userSchema.statics.delFavEvents = function(idUser,idEvent){
    const deleteFav =  User.findByIdAndUpdate(
        {_id: idUser },
        {$addToSet: {fav_events: idEvent } },
        {new: true}
    ).exec()
        return deleteFav
};

//Find own events
userSchema.statics.findOwnEvents = function(idUser, activeEvents = true){
    let currentDate = new Date();
    // const findEvents = User.find( {$and:[{'_id':idUser},{'my_events.date':{ $lte: Date.now()}}]}).populate('my_events').exec()
    //const findEvents = User.find({_id:idUser}).populate('my_events').exec()
   
    const findEvents = User.find({_id:idUser}).
        populate(
            {path:'my_events',
            match: { date: { $gte: currentDate }}
    }).exec()

    //const findEvents = User.find( {'created_date':{$lte: currentDate}}).populate('my_events').exec()
    return findEvents
}

const User = mongoose.model('User', userSchema);

module.exports = User;
