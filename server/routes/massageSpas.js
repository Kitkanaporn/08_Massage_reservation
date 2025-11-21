const express = require('express') ;
const appointmentRouter = require('./appointments') ;
const router = express.Router() ;
const { protect , authorize } = require("../controllers/auth") ;
const { getMassageSpas , getMassageSpa , createMassageSpa , updateMassageSpa , deleteMassageSpa } = required("../controllers/messageSpas") ;

router.use('/:massageSpaId/appointments' , appointmentRouter) ;

router.route("/")
    .get(getMassageSpas)
    .post(protect , authorize("admin") , createMassageSpa) ;

router.route("/:id")
    .get(getMassageSpa)
    .put(protect , authorize("admin") , updateMassageSpa)
    .delete(protect , authorize("admin") , deleteMassageSpa) ;

module.exports = router ;