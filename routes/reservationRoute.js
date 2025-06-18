/* **********************
 * Reservation Route
*************************/

//Need Resources
const express = require('express')
const router = express.Router()

//import utilities
const utilities = require('../utilities')

const resValidate = require('../utilities/reservation-validation')

// import all controllers
const reservationCont = require('../controllers/reservationController')

// Add routes
router.get('/accounts/:account_id', utilities.handleErrors(reservationCont.buildReservation))

router.post('/accounts/:account_id',
    resValidate.addReservationRules(),
    resValidate.checkAddReservationData,
    utilities.handleErrors(reservationCont.addReservation)
)

router.post('/delete',
    resValidate.deleteReservationRules(),
    resValidate.checkAddReservationData,
    utilities.handleErrors(reservationCont.deleteReservation)
)

module.exports = router;
