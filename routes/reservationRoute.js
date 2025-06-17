/* **********************
 * Reservation Route
*************************/

//Need Resources
const express = require('express')
const router = express.Router()

//import utilities
const utilities = require('../utilities')

// import all controllers
const reservationCont = require('../controllers/reservationController')

// Add routes
router.get('/accounts/:account_id', utilities.handleErrors(reservationCont.buildReservation))
router.post('/', utilities.handleErrors(reservationCont.getReservationJSON))
router.post('/accounts/:account_id', utilities.handleErrors(reservationCont.addReservation))
router.post('/delete/:reservation_id', utilities.handleErrors(reservationCont.deleteReservation))

module.exports = router;
