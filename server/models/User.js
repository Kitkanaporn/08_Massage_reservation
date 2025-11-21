const mongoose = require('mongoose') ;
const bcrypt = require('bcryptjs') ;
const JWT = require('jsonwebtoken') ;

const UserSchema = new mongoose.Schema({

    name : {
        type : String , 
        required : [true , "please add user name" ] ,
        trim : true ,
        maxlength : [100 , "user name can not be more than 100 characters" ]
    } ,
    
    telephoneNumber : {
        type : String ,
        maxlength : [10 , 'please add user telephone can not more than 10 charecters'] ,
        required : [true , "Please add user telephone number" ],
    } ,

    email : {
        type : String ,
        required : [true , "please add user email" ] ,
        unique :  [true , "please use new email. this email already used"] ,
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    } ,

    role : {
        type : String ,
        enum : ['user' , 'admin'] ,
        default : 'user' ,
    } ,

    password : {
        type : String ,
        required : [true , "please add user password" ] ,
        minlength : 8 ,
        select : false , //บอกว่าจะไม่มีการดึงเข้อมูลส่วนนี้ไปหากมีการ find
    } ,

    resetPasswordToken : String ,
    resetPasswordExpire : Date ,

    createdAt : {
        type : Date ,
        default : Date.now ,
    }
});

//แปลงรหัสผ่านก่อนบันทึกลงฐานข้อมูล
UserSchema.pre('save' , async function(next) {
    const salt = await bcrypt.genSalt(10) ;
    this.password = await bcrypt.hash(this.password , salt) ;
});

//เรียกให้สร้าง JWT token
UserSchema.methods.getSignedJwtToken = function() {
    return JWT.sign({id : this._id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRE
    }) ;
}

//ตรวจสอบรหัสผ่านที่กรอกกับรหัสผ่านที่เก็บในฐานข้อมูล
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword , this.password) ;
}

module.exports = mongoose.model('User' , UserSchema) ;
