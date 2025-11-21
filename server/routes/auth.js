const {express} = require("express") ;
const router = express.Router() ;
const {protect , authorize} = require("../middleware/auth") ;
const {register , login , logout , getme} = require("../controllers/auth")

router.post('/register' , register) ;
router.post('/login' , login) ;
router.get('/me' , protect , getme) ;
router.get('/logout' , logout) ;

module.exports = router ;

