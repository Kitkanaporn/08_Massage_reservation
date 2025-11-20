const express = require('express');
const dotenv = require('dotenv') ;
const cookieParser = require('cookie-parser') ;

const mongoSanitize = require('express-mongo-sanitize') ;
const cors = require('cors') ;
const helmet = require('helmet') ;
const {xss} = require('express-xss-sanitizer') ;
const rateLimit = require('express-rate-limit') ;
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express') ;
//Load env vars
dotenv.config({path:'./config/config.env'}) ;

const connectDB = require('./config/db') ; //import connectDB function
connectDB() ; //call connectDB function

//define MassageSpa routes
const massageSpas = require('./routes/massageSpas') ;
const auth = require('./routes/auth') ;
const appointments = require('./routes/appointments') ;

const app = express() ;

app.use(cors()) ;
app.use(express.json()) ; //middleware to accept json data
app.use(cookieParser()) ;
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  next();
});
app.use(helmet()) ;
app.use(xss()) ;

//Rate limiting
const limiter = rateLimit({
    windowMs : 10 * 60 * 1000 , //10 mins
    max : 100
}) ;
app.use(limiter) ;

const swaggerOptions = {
    swaggerDefinition : {
        openapi: '3.0.0',
        info : {
            title : 'Library API',
            version : '1.0.0' ,
            description : "A simple Express Library API"
        },
        servers : [
            {
                url : 'http://localhost:5000/api/v1'
            }
        ],
    },
    apis : ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions) ;
app.use('/api-docs' , swaggerUI.serve , swaggerUI.setup(swaggerDocs)) ;

//Mount routers of each resource in massage spa booking system
app.use('/api/v1/massageSpas' , massageSpas) ;
app.use('/api/v1/auth' , auth) ;
app.use('/api/v1/appointments' , appointments) ;
app.set('query parser', 'extended');



const PORT = process.env.PORT || 5000 ;
const server = app.listen(PORT, console.log("Server running in " , process.env.NODE_ENV , "mode on port" , PORT )) ;

//HAndle unhandled promise rejections
process.on('unhandledRejection' , (err , promise) => {
    console.log(`Error: ${err.message}`) ;
    //Close server & exit process
    server.close(() => process.exit(1)) ;
});