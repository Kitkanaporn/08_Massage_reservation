const MassageSpa = require('../models/MassageSpa') ;
const Appointment = require('../models/Appointment') ;

//Get all massage-spas
exports.getMassageSpas = async (req,res,next) => {
    let query ;

    //Copy req.query
    const reqQuery = {...req.query} ;
    //console.log(reqQuery) ;

    //Fields to exclude
    const removeFields = ['select' , 'sort' , 'page' , 'limit'] ;

    //Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]) ;
    console.log(reqQuery) ;

    //Create query string
    let queryStr = JSON.stringify(reqQuery) ;
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = MassageSpa.find(JSON.parse(queryStr))/*.populate(/*'appointments')*/ ;
    //console.log(req.query) ;

    //Select Fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ') ;
        query = query.select(fields) ;
    }

    //Sort
    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ') ;
        query = query.sort(sortBy) ;
    } else {
        query = query.sort('-createdAt') ;
    }

    //Pagination
    const page = parseInt(req.query.page , 10) || 1 ;
    const limit = parseInt(req.query.limit , 10) || 25 ;
    const startIndex = (page - 1) * limit ;
    const endIndex = page * limit ;

    try {
    const total = await MassageSpa.countDocuments() ;
    query = query.skip(startIndex).limit(limit) ;
    
    //Execute query
    const massageSpas = await query.select("name address province tel openTime closeTime") ;
    //console.log(req.query) ;


    //Pagination result
    const pagination = {} ;
    if(endIndex < total) {
        pagination.next = {
            page : page + 1 ,
            limit 
        } ;
    }
    if(startIndex > 0) {
        pagination.prev = {
            page : page - 1 ,
            limit 
        } ;
    }

    res.status(200).json({
        success:true ,  
        count : massageSpas.length , 
        pagination ,
        data : massageSpas
    }) ;

    } catch (err) {
        res.status(400).json({success:false}) ;
    }
};

//Get single massage-spa
exports.getMassageSpa = async (req,res,next) => {
    try {
        const massageSpa = await MassageSpa.findById(req.params.id).select("name address province tel openTime closeTime") ;
        if(!massageSpa) {
            return res.status(404).json({success:false , msg : `MassageSpa not found with id of ${req.params.id}`}) ;
        }
        res.status(200).json({success:true , data : massageSpa}) ;
    } catch (err) {
        return res.status(400).json({success:false}) ;
    }
    
};

//Create new MassageSpa
exports.createMassageSpa = async (req,res,next) => {
    const massageSpa = await MassageSpa.create(req.body) ;
    res.status(201).json({success:true , data : massageSpa}) ;
};

//Update massageSpa
exports.updateMassageSpa = async (req,res,next) => {
    try {
        const massageSpa = await MassageSpa.findByIdAndUpdate(req.params.id , req.body , {
            new : true ,
            runValidators : true 
        }) ;

        if(!massageSpa) {
            return res.status(400).json({success:false}) ;
        }

        res.status(200).json({success:true , data : massageSpa}) ;
    } catch (err) {
        return res.status(400).json({success:false}) ;
    }
   
};

//Delete massageSpa
exports.deleteMassageSpa = async (req,res,next) => {  
    try {
        const massageSpa = await MassageSpa.findById(req.params.id) ;
        
        if(!massageSpa) {
            return res.status(404).json({success:false , message : `MassageSpa not found with id of ${req.params.id}`}) ;
        }

        await Appointment.deleteMany({massageSpa : req.params.id}) ;
        await MassageSpa.deleteOne({_id : req.params.id}) ;

        res.status(200).json({success:true , data : {}}) ;
    } catch (err) {
        return res.status(400).json({success:false}) ;
    }
    
};