/* ***********************
 * Account Route
 *************************/

//Need Resources
const express = require('express')
const router = express.Router()
const utilities = require('../utilities')

const regValidate = require('../utilities/account-validation')
const accountCont = require('../controllers/accountController')

//Deliver account management
router.get('/',
    utilities.checkLogin,
    utilities.handleErrors(accountCont.buildAccountManagement)
)

//Deliver login
router.get('/login', utilities.handleErrors(accountCont.buildLogin))

//Deliver registration
router.get('/register', utilities.handleErrors(accountCont.buildRegistration))

//Logout
router.get('/logout', utilities.handleErrors(accountCont.accountLogout))


//Deliver login
router.post('/login', 
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accountCont.accountLogin)
)

//Regiser account
router.post('/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountCont.registerAccount)
)

module.exports = router

