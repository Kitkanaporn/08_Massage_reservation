// ใช้สำหรับเชื่อมต่อกับ MongoDB โดยเฉพาะ
const mongoose = require('mongoose');

// ฟังก์ชันสำหรับเชื่อมต่อกับฐานข้อมูล MongoDB // use with await = async
const connectDB = async () => {
    mongoose.set('strictQuery' , true) ; // ตั้งค่า strictQuery เป็น true เพื่อให้ Mongoose ตรวจสอบ query อย่างเข้มงวดขึ้น
    const conn = await mongoose.connect(process.env.MONGO_URI , {
        
    }) ;
    console.log(`MongoDB connect: ${conn.connection.host}`) ;
}

module.exports = connectDB ; 