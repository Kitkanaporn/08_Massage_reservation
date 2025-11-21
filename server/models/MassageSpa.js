const mongoose = require('mongoose') ;

const MassageSpaSchema = new mongoose.Schema({

    name : {
        type : String ,
        required : [true , "please add spa name" ] ,
        unique : true ,
        trim : true ,
        maxlength : [100 , "spa name can not be more than 100 characters" ] ,
    },

    address : {
        type : String ,
        required : [true , "please add spa address" ] ,
    } ,

    district : {
        type : String ,
        required : [true , "please add spa district" ] ,
    } ,

    province : {
        type : String ,
        required : [true , "please add spa province" ] ,
    } ,

    postalCode : {
        type : String ,
        required : [true , "please add spa postal code" ] ,
        maxlength : [5 , 'postal code can not be more than 5 characters' ] ,
    } , 

    tel : {
        type : String ,
        maxlength : [10 , 'please add spa telephone can not more than 10 charecters']
    } ,

    region : {
        type : String ,
        required : [true , "please add spa region" ] ,
    } ,

    openTime: {
        type: String,
        required: [true, "Please add open time"],
    },

    closeTime: {
        type: String,
        required: [true, "Please add close time"],
    }

} , {
    toJSON : { virtuals : true } ,
    toObject : { virtuals : true }
}) ;

MassageSpaSchema.virtual('appointments' , {
    ref : 'Appointment' ,
    localField : '_id' ,
    foreignField : 'massageSpa' ,
    justOne : false
}) ;

module.exports = mongoose.model('MassageSpa' , MassageSpaSchema) ;
