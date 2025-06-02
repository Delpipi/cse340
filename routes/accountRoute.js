/* ***********************
 * Account Route
 *************************/

//Need Resources
const express = require('express')
const router = express.Router()
const utilities = require('../utilities')

const accountCont = require('../controllers/accountController')

//Deliver login
router.get('/login', utilities.handleErrors(accountCont.buildLogin))

module.exports = router

