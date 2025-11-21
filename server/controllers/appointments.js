const Appointment = require('../models/Appointment') ;
const MassageSpa = require('../models/MassageSpa') ;


//Get all appointments
exports.getAppointments = async (req , res , next) => {
    let query ;

    //Generale user can see only their appointments
    if(req.user.role !== 'admin') {
        query = Appointment.find({user : req.user.id}).populate({
            path : 'massageSpa' ,
            select : 'name province tel'
        }) ;
    } else{
        if (req.params.massageSpaID) {
                console.log("massageSpaID is " , req.params.massageSpaID) ;
                query = Appointment.find({massageSpa : req.params.massageSpaID})
        }else {
            query = Appointment.find().populate({
                path : 'massageSpa' ,
                select : 'name province tel'
            }) ;
        }
    } 

    try{
        const appointments = await query ;
          
        res.status(200).json({
            success:true ,  
            count : appointments.length , 
            data : appointments
        });
    } catch (error) {
        console.log(error.stack) ;
        res.status(400).json({
            success:false ,
            message : "Cannot find appointments"
        }) ;
    }
};


//Get single appointment
exports.getAppointment = async (req,res,next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate({
            path : 'massageSpa' ,
            select : 'name description tel'
        }) ;

        if (!appointment) {
            return res.status(404).json({
                success : false ,
                message : `No appointment with the id of ${req.params.id}` 
            })
        }else{
            res.stratus(200).json({
                success : true ,
                data : appointment
            }) ;
        }
    }catch (error) {
        console.log(error) ;
        res.status(500).json({
            success : false ,
            message : "Cannot find appointment"
        })
    }
};


//Add appointment 
exports.addAppointment = async (req , res , next) => {
    try {
        //Add massagespa to req.body
        req.body.massageSpa = req.params.massageSpaId ;
        const massageSpa = await MassageSpa.findById(req.params.massageSpaId) ;
        
        if(!massageSpa) {
            return res.status(404).json({
                success:false , 
                message : `No massageSpa with the id of ${req.params.massageSpaId}`
            }) ;
        }

        //Add user to req.body
        req.body.user = req.user.id ;

        //Check for published appointment
        const existedAppointment = await Appointment.find({user:req.user.id}) ;

        //If the user is not an admin, they can only add one appointment
        if(existedAppointment.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({
                success:false ,
                message : `The user with ID ${req.user.id} has already created 3 appointments`
            }) ;
        }

        const appointment = await Appointment.create(req.body) ;
        res.status(200).json({
            success:true , 
            data : appointment
        }) ;
    } catch (error) {
        console.log(error) ;
        res.status(500).json({
            success:false , 
            message : "Cannot add appointment"
        }) ;
    }
};


//Update appointment
exports.updateAppointment = async (req,res,next) => {
    try {
        let appointment = await Appointment.findById(req.params.id) ;

        if(!appointment) {
            return res.status(404).json({
                success:false , 
                message : `No appointment with the id of ${req.params.id}`
            }) ;
        }

        //Make sure user is appointment owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success:false , 
                message : `User ${req.user.id} is not authorized to update this appointment`
            }) ;
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators : true
        }) ;

        res.status(200).json({
            success:true , 
            data : appointment
        }) ;
    } catch (error) {
        console.log(error) ;
        return res.status(500).json({ 
            success:false ,
            message : "Cannot update appointment"
        }) ;
    }
};


//Delete appointment
exports.deleteAppointment = async (req,res,next) => {
    try {
        const appointment = await Appointment.findById(req.params.id) ;

        //ถ้าไม่มี appointment นี้ในระบบ
        if(!appointment) {
            res.status(404).json({
                success:false , 
                message : `No appointment with the id of ${req.params.id}`
            }) ;
        }

        //Make sure user is appointment owner
        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success:false , 
                message : `User ${req.user.id} is not authorized to delete this appointment`
            }) ;
        }

        await appointment.deleteOne() ;

        res.status(200).json({
            success:true ,
            data : {}
        }) ;
        
    } catch (error) {
        console.log(error) ;
        return res.status(500).json({ 
            success:false ,
            message : "Cannot delete appointment"
        }) ;
    }
};
