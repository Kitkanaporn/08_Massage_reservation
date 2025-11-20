const mongoose = require('mongoose') ;

const AppointmentSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true
    } ,

    massageSpa : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'MassageSpa' ,
        required : true
    } ,

    apptDate : {
        type : Date ,
        required : [true , "please add appointment date" ]
    },

    createdAt : {
        type : Date ,
        default : Date.now
    }
}) ;

module.exports = mongoose.model('Appointment' , AppointmentSchema) ;