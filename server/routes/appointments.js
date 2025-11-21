const express = require("express") ;
const {protect , authorize} = require("../middleware/auth") ;
const { router } = express.Router() ;
const { getAppointments , getAppointment , addAppointment , updateAppointment , deleteAppointment} = require("../controllers/appointments") ;

router.route("/")
    .get(protect , getAppointments) //Get All Appointments
    .post(protect , authorize('user' , 'admin') , addAppointment) ; //Add Appointment

router.route("/:id")
    .get(protect , getAppointment) //Get Single Appointment
    .put(protect , authorize('user' , 'admin') , updateAppointment) //Update Appointment
    .delete(protect , authorize('user' , 'admin') , deleteAppointment) ; //Delete Appointment

module.exports = router ;