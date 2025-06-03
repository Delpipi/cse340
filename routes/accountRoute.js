/* ***********************
 * Account Route
 *************************/

//Need Resources
const express = require('express')
const router = express.Router()
const utilities = require('../utilities')

const regValidate = require('../utilities/account-validation')
const accountCont = require('../controllers/accountController')

//Deliver login
router.get('/login', utilities.handleErrors(accountCont.buildLogin))
//Deliver registration
router.get('/register', utilities.handleErrors(accountCont.buildRegistration))
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountCont.registerAccount)
)

module.exports = router

